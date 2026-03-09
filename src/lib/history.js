import Events from './Events';

export const updates = {};

const MAX_HISTORY = 16;

// History stacks
const undoStack = [];
const redoStack = [];

/**
 * Capture the current scene state as a serialized HTML string
 */
function captureSceneState() {
  const scene = AFRAME.scenes[0];
  if (!scene) return null;

  // Clone the scene and filter out inspector elements
  const clone = scene.cloneNode(true);
  
  // Remove inspector-injected elements
  const inspectorElements = clone.querySelectorAll('[data-aframe-inspector], [data-is-inspector]');
  inspectorElements.forEach(el => el.remove());
  
  return clone.innerHTML;
}

/**
 * Apply a captured state to the scene
 */
function applySceneState(html) {
  const scene = AFRAME.scenes[0];
  if (!scene || !html) return false;

  try {
    // Get the currently selected entity to restore selection after
    const selectedEntity = AFRAME.INSPECTOR.selectedEntity;
    const selectedId = selectedEntity?.id;

    // Parse the HTML and replace the scene content
    // We need to be careful not to destroy the scene object
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove all non-inspector children from scene
    const toRemove = [];
    scene.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!child.dataset?.isInspector && !child.isInspector) {
          toRemove.push(child);
        }
      }
    });
    
    // Add the new children
    while (temp.firstChild) {
      const child = temp.firstChild;
      if (child.nodeType === Node.ELEMENT_NODE) {
        // Skip inspector elements
        if (!child.dataset?.isInspector && !child.hasAttribute('aframe-injected')) {
          scene.appendChild(child);
        }
      }
      temp.removeChild(child);
    }

    // Try to restore selection
    if (selectedId) {
      const newSelected = document.getElementById(selectedId);
      if (newSelected && newSelected.isEntity) {
        AFRAME.INSPECTOR.selectEntity(newSelected);
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to apply scene state:', err);
    return false;
  }
}

/**
 * Push current state to history stack (call before making changes)
 */
export function pushHistory(actionType = 'change') {
  const state = captureSceneState();
  if (!state) return;

  // Clear redo stack when new action is performed
  redoStack.length = 0;

  // Add to undo stack
  undoStack.push({
    type: actionType,
    state: state,
    timestamp: Date.now()
  });

  // Limit stack size
  while (undoStack.length > MAX_HISTORY) {
    undoStack.shift();
  }

  // Emit event for UI updates
  Events.emit('historychange', { 
    canUndo: undoStack.length > 0, 
    canRedo: redoStack.length > 0 
  });
}

/**
 * Undo the last action
 */
export function undo() {
  if (undoStack.length === 0) return false;

  // Save current state to redo stack
  const currentState = captureSceneState();
  if (currentState) {
    redoStack.push({
      type: 'redo',
      state: currentState,
      timestamp: Date.now()
    });
  }

  // Pop from undo stack and apply
  const historyEntry = undoStack.pop();
  const success = applySceneState(historyEntry.state);

  // Emit event for UI updates
  Events.emit('historychange', { 
    canUndo: undoStack.length > 0, 
    canRedo: redoStack.length > 0 
  });

  return success;
}

/**
 * Redo the last undone action
 */
export function redo() {
  if (redoStack.length === 0) return false;

  // Save current state to undo stack
  const currentState = captureSceneState();
  if (currentState) {
    undoStack.push({
      type: 'redo-undo',
      state: currentState,
      timestamp: Date.now()
    });
  }

  // Pop from redo stack and apply
  const historyEntry = redoStack.pop();
  const success = applySceneState(historyEntry.state);

  // Emit event for UI updates
  Events.emit('historychange', { 
    canUndo: undoStack.length > 0, 
    canRedo: redoStack.length > 0 
  });

  return success;
}

/**
 * Check if undo is available
 */
export function canUndo() {
  return undoStack.length > 0;
}

/**
 * Check if redo is available
 */
export function canRedo() {
  return redoStack.length > 0;
}

/**
 * Get history status
 */
export function getHistoryStatus() {
  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    undoCount: undoStack.length,
    redoCount: redoStack.length
  };
}

/**
 * Clear all history
 */
export function clearHistory() {
  undoStack.length = 0;
  redoStack.length = 0;
  Events.emit('historychange', { canUndo: false, canRedo: false });
}

// Listen for entity changes and auto-capture history
Events.on('entitycreate', () => pushHistory('create'));
Events.on('entitydelete', () => pushHistory('delete'));
Events.on('entitymove', () => pushHistory('move'));
Events.on('entityreparented', () => pushHistory('reparent'));
Events.on('componentchange', () => pushHistory('component'));

/**
 * Store change to export.
 *
 * payload: entity, component, property, value.
 */
Events.on('entityupdate', (payload) => {
  let value = payload.value;

  const entity = payload.entity;
  updates[entity.id] = updates[entity.id] || {};

  const component = AFRAME.components[payload.component];
  if (component) {
    if (payload.property) {
      updates[entity.id][payload.component] =
        updates[entity.id][payload.component] || {};
      if (component.schema[payload.property]) {
        value = component.schema[payload.property].stringify(payload.value);
      }
      updates[entity.id][payload.component][payload.property] = value;
    } else {
      value = component.schema.stringify(payload.value);
      updates[entity.id][payload.component] = value;
    }
  }
});
