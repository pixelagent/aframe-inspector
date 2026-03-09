import Events from './Events';

/**
 * BehaviorsManager - Dreamweaver-style JavaScript Behaviors for A-Frame
 * 
 * Allows users to add interactive behaviors to A-Frame entities without writing code.
 * Inspired by Adobe Dreamweaver's JavaScript Behaviors system.
 */

// Common event types
const EVENT_TYPES = [
  { value: 'click', label: 'On Click' },
  { value: 'dblclick', label: 'On Double Click' },
  { value: 'mouseenter', label: 'On Mouse Enter' },
  { value: 'mouseleave', label: 'On Mouse Leave' },
  { value: 'mousedown', label: 'On Mouse Down' },
  { value: 'mouseup', label: 'On Mouse Up' },
  { value: 'fusing', label: 'On Fusing (VR)' },
  { value: 'loaded', label: 'On Loaded' },
  { value: 'animationstart', label: 'On Animation Start' },
  { value: 'animationcomplete', label: 'On Animation Complete' },
  { value: 'animationcancel', label: 'On Animation Cancel' },
  { value: 'animationiteration', label: 'On Animation Iteration' }
];

// Custom event type for user-defined events
const CUSTOM_EVENT_TYPES = [
  { value: 'custom-click', label: 'Custom Click Event' },
  { value: 'custom-hover', label: 'Custom Hover Event' },
  { value: 'custom-pulse', label: 'Custom Pulse Event' },
  { value: 'custom-rotate', label: 'Custom Rotate Event' },
  { value: 'custom-scale', label: 'Custom Scale Event' },
  { value: 'custom-move', label: 'Custom Move Event' }
];

// Help text for behaviors
const BEHAVIOR_HELP = {
  'goto-url': {
    description: 'Navigates the browser to a specified URL.',
    examples: [
      'Go to Google: URL = https://www.google.com, Target = _blank',
      'Go to internal page: URL = /about.html, Target = _self'
    ],
    generatedCode: `window.open('https://example.com', '_blank');`
  },
  'go-back': {
    description: 'Navigates to the previous page in the browser history.',
    examples: ['No parameters needed - just add the behavior'],
    generatedCode: `if (history.length > 0) { history.back(); }`
  },
  'go-forward': {
    description: 'Navigates to the next page in the browser history.',
    examples: ['No parameters needed - just add the behavior'],
    generatedCode: `if (history.length > 0) { history.forward(); }`
  },
  'goto-scene': {
    description: 'Moves the camera to a specific scene entity position.',
    examples: ['Select a camera entity as the target to move the view to that position'],
    generatedCode: `// Moves camera to target entity position`
  },
  'open-window': {
    description: 'Opens a new browser window with specified settings.',
    examples: [
      'Popup window: URL = https://google.com, Width = 600, Height = 400',
      'With toolbar: URL = https://example.com, Toolbar = checked'
    ],
    generatedCode: `window.open('url', 'name', 'width=400,height=300,toolbar=yes');`
  },
  'play-media': {
    description: 'Plays audio or video on the target element.',
    examples: [
      'Play sound: Target = this element, Media Type = sound',
      'Play video: Target = #videoEntity, Media Type = video'
    ],
    generatedCode: `el.components['sound'].play();`
  },
  'stop-media': {
    description: 'Stops audio or video on the target element.',
    examples: ['Stop sound on click'],
    generatedCode: `el.components['sound'].stop();`
  },
  'toggle-media': {
    description: 'Toggles between play and pause for audio/video.',
    examples: ['Click to play, click again to pause'],
    generatedCode: `// Toggles between play and stop`
  },
  'show-element': {
    description: 'Makes the target element visible.',
    examples: ['Show a hidden panel on click'],
    generatedCode: `el.setAttribute('visible', true);`
  },
  'hide-element': {
    description: 'Hides the target element.',
    examples: ['Hide a menu on click'],
    generatedCode: `el.setAttribute('visible', false);`
  },
  'toggle-visibility': {
    description: 'Toggles between visible and hidden states.',
    examples: [
      'Toggle self: Target = This Element',
      'Show another: Mode = show, Target = #otherElement',
      'Hide another: Mode = hide, Target = #otherElement'
    ],
    generatedCode: `var visible = el.getAttribute('visible'); el.setAttribute('visible', !visible);`
  },
  'set-property': {
    description: 'Sets any property/attribute on an element.',
    examples: [
      'Change color: Property = material/color, Value = #FF0000',
      'Change scale: Property = scale, Value = 2 2 2',
      'Change position: Property = position, Value = 0 1 -3',
      'Change text: Property = text/value, Value = Hello World'
    ],
    generatedCode: `el.setAttribute('property', 'value');`
  },
  'swap-image': {
    description: 'Changes the texture/image on an element. Can also restore the original image on mouseout for rollover effects.',
    examples: [
      'Simple swap: Event = click, New Image = #texture2',
      'Rollover: Event = mouseenter, New Image = #hoverTexture, Restore Image = #originalTexture, Restore Event = mouseleave'
    ],
    generatedCode: `// On event: el.setAttribute('material', 'src', '#newImage');
// On restore: el.setAttribute('material', 'src', originalSrc);`
  },
  'popup-message': {
    description: 'Shows a browser alert dialog with your message.',
    examples: ['Show welcome message: Message = Welcome to our site!'],
    generatedCode: `alert('Hello World!');`
  },
  'set-status-bar': {
    description: 'Sets the browser status bar text.',
    examples: ['Show loading status: Status Text = Loading...'],
    generatedCode: `window.status = 'Loading...';`
  },
  'set-text': {
    description: 'Changes the text content of an element.',
    examples: [
      'Change 3D text: Selector = #myText, Text = New Value',
      'Update score: Selector = #scoreDisplay, Text = Score: 100'
    ],
    generatedCode: `document.querySelector('#selector').setAttribute('text', 'value', 'New Text');`
  },
  'start-animation': {
    description: 'Starts/triggers an animation on the element.',
    examples: [
      'Trigger default animation: Animation Name = animation',
      'Trigger named: Animation Name = animation__spin'
    ],
    generatedCode: `el.emit('animation');`
  },
  'stop-animation': {
    description: 'Removes/stops animation from the element.',
    examples: ['Stop any running animation'],
    generatedCode: `el.removeAttribute('animation');`
  },
  'toggle-animation': {
    description: 'Toggles animation between enabled and disabled.',
    examples: ['Click to start/stop animation'],
    generatedCode: `// Toggles animation enabled state`
  },
  'enter-vr': {
    description: 'Enters VR mode for virtual reality viewing.',
    examples: ['Enter VR on click'],
    generatedCode: `this.el.sceneEl.enterVR();`
  },
  'enter-ar': {
    description: 'Enters AR mode for augmented reality viewing.',
    examples: ['Enter AR on click'],
    generatedCode: `this.el.sceneEl.enterAR();`
  },
  'exit-vr': {
    description: 'Exits VR/AR mode back to standard view.',
    examples: ['Exit VR on click'],
    generatedCode: `this.el.sceneEl.exitVR();`
  },
  'call-javascript': {
    description: 'Calls a custom JavaScript function. The function must be defined globally.',
    examples: [
      'Alert: Function Name = alert, Parameters = {"message":"Hello!"}, Pass element = unchecked',
      'Prompt: Function Name = prompt, Parameters = {"question":"Your name?","default":"John"}',
      'Custom with element: Function Name = myFunction, Parameters = {"color":"#FF0000"}, Pass element = checked'
    ],
    generatedCode: `// Example global functions:
function myFunction(el, options) {
  el.setAttribute('color', options.color);
}

// Or use built-in:
alert('Hello!');
prompt('What is your name?');
confirm('Are you sure?');`
  },
  'anime-pulse': {
    description: 'Creates a pulsing scale animation using anime.js library.',
    examples: [
      'Gentle pulse: Scale = 1.1, Duration = 500, Loop = 0 (forever)',
      'Bouncy pulse: Scale = 1.2, Duration = 300, Easing = easeOutElastic'
    ],
    generatedCode: `anime({ targets: el.object3D, scale: 1.2, duration: 500, easing: 'easeInOutSine', direction: 'alternate', loop: true });`
  },
  'anime-rotate': {
    description: 'Rotates the element around specified axes.',
    examples: [
      'Spin around Y: Axis = y, Angle = 360, Duration = 2000',
      'Spin 3D: Axis = xyz, Angle = 360, Loop = 1'
    ],
    generatedCode: `anime({ targets: el.object3D, rotationY: 360, duration: 2000, easing: 'linear', loop: true });`
  },
  'anime-scale': {
    description: 'Animates the scale of the element.',
    examples: [
      'Grow: Scale X/Y/Z = 1.5, Direction = alternate',
      'Squash and stretch: Scale Y = 0.5, Scale X = 1.5'
    ],
    generatedCode: `anime({ targets: el.object3D, scaleX: 1.5, scaleY: 1.5, scaleZ: 1.5, duration: 500, easing: 'easeInOutBack' });`
  },
  'anime-color': {
    description: 'Animates the color of the element material.',
    examples: ['Change to red: Color = #FF0000'],
    generatedCode: `anime({ targets: el.getAttribute('material'), color: '#FF0000', duration: 500 });`
  },
  'anime-move': {
    description: 'Moves the element to a new position.',
    examples: [
      'Move forward: Position Z = -5, Duration = 1000',
      'Move up: Position Y = 2'
    ],
    generatedCode: `anime({ targets: el.object3D.position, x: 0, y: 1, z: -3, duration: 1000, easing: 'easeInOutQuad' });`
  },
  'trigger-event': {
    description: 'Triggers a custom event that can start other behaviors (for chaining animations).',
    examples: [
      'Trigger pulse: Custom Event = custom-pulse, Delay = 0',
      'Chain after delay: Custom Event = custom-rotate, Delay = 500'
    ],
    generatedCode: `el.emit('custom-pulse'); // Other behaviors can listen for this event`
  }
};

class BehaviorsManager {
  constructor() {
    this.behaviors = new Map();
    this.selectedBehavior = null;
    this.currentEntity = null;
  }

  /**
   * Get available event types
   */
  static getEventTypes() {
    return EVENT_TYPES;
  }

  /**
   * Get custom event types
   */
  static getCustomEventTypes() {
    return CUSTOM_EVENT_TYPES;
  }

  /**
   * Get all event types combined
   */
  static getAllEventTypes() {
    return [...EVENT_TYPES, ...CUSTOM_EVENT_TYPES];
  }

  /**
   * Get all entities in the scene for selection
   */
  static getSceneEntities() {
    const scene = AFRAME.scenes[0];
    if (!scene) return [];

    const entities = [];
    scene.querySelectorAll('*').forEach(el => {
      if (el !== scene && el.id) {
        entities.push({
          value: `#${el.id}`,
          label: el.tagName.toLowerCase() + (el.getAttribute('id') ? `#${el.getAttribute('id')}` : '')
        });
      }
    });
    return entities;
  }

  /**
   * Get available images/assets (from scene assets)
   */
  static getAvailableAssets() {
    const scene = AFRAME.scenes[0];
    if (!scene) return [];

    const assets = [];
    const assetManager = scene.assetManager;
    if (assetManager && assetManager.el) {
      assetManager.el.querySelectorAll('img').forEach(img => {
        if (img.id) {
          assets.push({ value: `#${img.id}`, label: img.id });
        }
      });
    }
    return assets;
  }

  /**
   * Get all textures/images from the scene (including from textureModal)
   * This includes assets and any images referenced in entities
   */
  static getAllTextures() {
    const scene = AFRAME.scenes[0];
    if (!scene) return [];

    const textures = [];
    const seen = new Set();

    // Get from asset manager
    const assetManager = scene.assetManager;
    if (assetManager && assetManager.el) {
      assetManager.el.querySelectorAll('img').forEach(img => {
        if (img.id && !seen.has(img.id)) {
          seen.add(img.id);
          textures.push({ value: `#${img.id}`, label: img.id, type: 'asset' });
        }
      });
    }

    // Get from entities with material src
    scene.querySelectorAll('[material]').forEach(el => {
      const material = el.getAttribute('material');
      if (material && material.src) {
        const src = material.src;
        const id = typeof src === 'string' ? src.split('#')[1]?.split('?')[0] : null;
        if (id && !seen.has(id)) {
          seen.add(id);
          textures.push({ value: `#${id}`, label: id, type: 'entity' });
        }
      }
    });

    return textures;
  }

  /**
   * Get animations on an entity
   */
  static getEntityAnimations(entity) {
    if (!entity) return [];

    const animations = [];
    const anim = entity.getAttribute('animation');
    if (anim) {
      animations.push({ value: 'animation', label: 'Default Animation' });
    }

    // Check for animation__* attributes
    Object.keys(entity.attributes).forEach(attr => {
      if (attr.startsWith('animation__')) {
        const name = attr.replace('animation__', '');
        animations.push({
          value: attr,
          label: name ? `Animation: ${name}` : 'Animation'
        });
      }
    });

    return animations;
  }

  /**
   * Available behaviors with their configuration
   */
  static BEHAVIORS = {
    // Navigation Behaviors
    'goto-url': {
      name: 'Go To URL',
      icon: 'fa-external-link-alt',
      category: 'Navigation',
      description: 'Navigate to a URL',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'url', type: 'text', label: 'URL', default: 'https://' },
        {
          name: 'target', type: 'select', label: 'Target',
          options: ['_self', '_blank', '_parent', '_top'], default: '_self'
        }
      ],
      generate: (params) => `window.open('${params.url}', '${params.target}');`
    },
    'go-back': {
      name: 'Go To Previous Scene',
      icon: 'fa-arrow-left',
      category: 'Navigation',
      description: 'Go to previous scene in the scene list',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' }
      ],
      generate: () => `var scenes = document.querySelectorAll('a-scene'); var current = this.el.sceneEl; var currentIndex = Array.from(scenes).indexOf(current); var prevIndex = currentIndex > 0 ? currentIndex - 1 : scenes.length - 1; scenes.forEach(function(s, i) { s.setAttribute('visible', i === prevIndex); });`
    },
    'go-forward': {
      name: 'Go To Next Scene',
      icon: 'fa-arrow-right',
      category: 'Navigation',
      description: 'Go to next scene in the scene list',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' }
      ],
      generate: () => `var scenes = document.querySelectorAll('a-scene'); var current = this.el.sceneEl; var currentIndex = Array.from(scenes).indexOf(current); var nextIndex = currentIndex < scenes.length - 1 ? currentIndex + 1 : 0; scenes.forEach(function(s, i) { s.setAttribute('visible', i === nextIndex); });`
    },
    'goto-scene': {
      name: 'Go To Scene',
      icon: 'fa-map-marker-alt',
      category: 'Navigation',
      description: 'Navigate to a scene entity',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Scene', default: '' }
      ],
      generate: (params) => {
        const target = params.target || '';
        return `var targetEl = document.querySelector('${target}'); if (targetEl && targetEl.components.camera) { var cam = targetEl; var rig = cam.object3D.parent; if (rig) { rig.object3D.position.copy(cam.object3D.getWorldPosition(new THREE.Vector3())); } }`;
      }
    },
    'open-window': {
      name: 'Open Window',
      icon: 'fa-window-restore',
      category: 'Navigation',
      description: 'Open new browser window',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'url', type: 'text', label: 'URL', default: 'https://' },
        { name: 'name', type: 'text', label: 'Window Name', default: 'newWin' },
        { name: 'width', type: 'number', label: 'Width', default: 400 },
        { name: 'height', type: 'number', label: 'Height', default: 300 },
        { name: 'toolbar', type: 'checkbox', label: 'Toolbar', default: false },
        { name: 'scrollbars', type: 'checkbox', label: 'Scrollbars', default: true }
      ],
      generate: (params) => `window.open('${params.url}', '${params.name}', 'width=${params.width},height=${params.height},toolbar=${params.toolbar ? 'yes' : 'no'},scrollbars=${params.scrollbars ? 'yes' : 'no'}');`
    },

    // Interaction Behaviors
    'play-media': {
      name: 'Play Media',
      icon: 'fa-play',
      category: 'Interaction',
      description: 'Play audio or video',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'mediaType', type: 'select', label: 'Media Type', options: ['sound', 'video'], default: 'sound' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const mediaType = params.mediaType || 'sound';
        return `var el = ${target}; el.components['${mediaType}'] && el.components['${mediaType}'].play();`;
      }
    },
    'stop-media': {
      name: 'Stop Media',
      icon: 'fa-stop',
      category: 'Interaction',
      description: 'Stop audio or video',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'mediaType', type: 'select', label: 'Media Type', options: ['sound', 'video'], default: 'sound' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const mediaType = params.mediaType || 'sound';
        return `var el = ${target}; el.components['${mediaType}'] && el.components['${mediaType}'].stop();`;
      }
    },
    'toggle-media': {
      name: 'Toggle Media',
      icon: 'fa-play-circle',
      category: 'Interaction',
      description: 'Toggle audio or video on/off',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'mediaType', type: 'select', label: 'Media Type', options: ['sound', 'video'], default: 'sound' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const mediaType = params.mediaType || 'sound';
        return `var el = ${target}; var media = el.components['${mediaType}']; if (media) { if (media.isPlaying) { media.stop(); } else { media.play(); } }`;
      }
    },
    'show-element': {
      name: 'Show Element',
      icon: 'fa-eye',
      category: 'Interaction',
      description: 'Show element',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        return `var el = ${target}; el.setAttribute('visible', true);`;
      }
    },
    'hide-element': {
      name: 'Hide Element',
      icon: 'fa-eye-slash',
      category: 'Interaction',
      description: 'Hide element',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        return `var el = ${target}; el.setAttribute('visible', false);`;
      }
    },
    'toggle-visibility': {
      name: 'Toggle Visibility',
      icon: 'fa-eye',
      category: 'Interaction',
      description: 'Show/hide element',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'mode', type: 'select', label: 'Mode', options: ['toggle', 'show', 'hide'], default: 'toggle' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const mode = params.mode || 'toggle';
        if (mode === 'show') {
          return `var el = ${target}; el.setAttribute('visible', true);`;
        } else if (mode === 'hide') {
          return `var el = ${target}; el.setAttribute('visible', false);`;
        } else {
          return `var el = ${target}; var visible = el.getAttribute('visible'); el.setAttribute('visible', !visible);`;
        }
      }
    },
    'set-property': {
      name: 'Set Property',
      icon: 'fa-cog',
      category: 'Interaction',
      description: 'Set any property on an element',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'property', type: 'text', label: 'Property', default: '' },
        { name: 'value', type: 'text', label: 'Value', default: '' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const property = params.property || '';
        const value = params.value || '';
        return `var el = ${target}; el.setAttribute('${property}', '${value}');`;
      }
    },
    'swap-image': {
      name: 'Swap Image',
      icon: 'fa-images',
      category: 'Interaction',
      description: 'Replace texture (with optional restore for rollover effect)',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'newSrc', type: 'texture', label: 'New Image', default: '' },
        { name: 'restoreSrc', type: 'texture', label: 'Restore Image (on mouseout)', default: '' },
        { name: 'restoreEvent', type: 'select', label: 'Restore Event', options: EVENT_TYPES, default: 'mouseleave' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const newSrc = params.newSrc || '';
        const restoreSrc = params.restoreSrc || '';
        const restoreEvent = params.restoreEvent || 'mouseleave';
        
        if (restoreSrc) {
          // Dreamweaver-style swap with restore (rollover)
          return `var el = ${target}; var originalSrc = el.getAttribute('material') ? el.getAttribute('material').src : ''; el.addEventListener('${params.event}', function() { el.setAttribute('material', 'src', '${newSrc}'); }); el.addEventListener('${restoreEvent}', function() { el.setAttribute('material', 'src', originalSrc || '${restoreSrc}'); });`;
        } else {
          return `var el = ${target}; el.setAttribute('material', 'src', '${newSrc}');`;
        }
      }
    },

    // Messages Behaviors
    'popup-message': {
      name: 'Popup Message',
      icon: 'fa-comment',
      category: 'Messages',
      description: 'Show alert message',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'message', type: 'textarea', label: 'Message', default: 'Hello World!' }
      ],
      generate: (params) => `alert('${params.message.replace(/'/g, "\\'")}');`
    },
    'set-status-bar': {
      name: 'Set Status Bar',
      icon: 'fa-info-circle',
      category: 'Messages',
      description: 'Set status text',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'message', type: 'text', label: 'Status Text', default: '' }
      ],
      generate: (params) => `window.status = '${params.message}';`
    },
    'set-text': {
      name: 'Set Text',
      icon: 'fa-font',
      category: 'Messages',
      description: 'Replace element text',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'selector', type: 'text', label: 'Element Selector', default: '' },
        { name: 'text', type: 'textarea', label: 'New Text', default: '' }
      ],
      generate: (params) => `var el = document.querySelector('${params.selector}'); if (el) { el.setAttribute('text', 'value', '${params.text}'); }`
    },

    // Animation Behaviors
    'start-animation': {
      name: 'Start Animation',
      icon: 'fa-play-circle',
      category: 'Animation',
      description: 'Play entity animation',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'animation', type: 'text', label: 'Animation Name', default: 'animation' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const animName = params.animation || 'animation';
        return `var el = ${target}; el.emit('${animName}');`;
      }
    },
    'stop-animation': {
      name: 'Stop Animation',
      icon: 'fa-stop-circle',
      category: 'Animation',
      description: 'Pause animation',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        return `var el = ${target}; el.removeAttribute('animation');`;
      }
    },
    'toggle-animation': {
      name: 'Toggle Animation',
      icon: 'fa-pause-circle',
      category: 'Animation',
      description: 'Play/pause animation',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        return `var el = ${target}; var anim = el.getAttribute('animation'); if (anim && anim.enabled !== false) { el.removeAttribute('animation'); } else { el.setAttribute('animation', 'enabled', true); }`;
      }
    },

    // VR/AR Behaviors
    'enter-vr': {
      name: 'Enter VR',
      icon: 'fa-vr-cardboard',
      category: 'VR/AR',
      description: 'Enter VR mode',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' }
      ],
      generate: () => `this.el.sceneEl.enterVR();`
    },
    'enter-ar': {
      name: 'Enter AR',
      icon: 'fa-mobile-alt',
      category: 'VR/AR',
      description: 'Enter AR mode',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' }
      ],
      generate: () => `this.el.sceneEl.enterAR();`
    },
    'exit-vr': {
      name: 'Exit VR',
      icon: 'fa-times-circle',
      category: 'VR/AR',
      description: 'Exit VR mode',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' }
      ],
      generate: () => `this.el.sceneEl.exitVR();`
    },

    // Anime.js Animation Behaviors
    'anime-pulse': {
      name: 'Pulse',
      icon: 'fa-heart',
      category: 'Anime.js',
      description: 'Pulse animation - scale up and down',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'scale', type: 'text', label: 'Scale (e.g., 1.2)', default: '1.2' },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 },
        { name: 'easing', type: 'select', label: 'Easing', options: ['easeInOutSine', 'easeInOutQuad', 'easeOutElastic', 'linear'], default: 'easeInOutSine' },
        { name: 'direction', type: 'select', label: 'Direction', options: ['normal', 'alternate'], default: 'alternate' },
        { name: 'loop', type: 'number', label: 'Loop Count (0=forever)', default: 0 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const scale = params.scale || '1.2';
        const duration = params.duration || 500;
        const easing = params.easing || 'easeInOutSine';
        const direction = params.direction || 'alternate';
        const loop = params.loop || 0;
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D, scale: ${scale}, duration: ${duration}, easing: '${easing}', direction: '${direction}', loop: ${loop === 0 ? 'true' : loop} }); }`;
      }
    },
    'anime-rotate': {
      name: 'Rotate',
      icon: 'fa-sync',
      category: 'Anime.js',
      description: 'Rotate animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'axis', type: 'select', label: 'Axis', options: ['x', 'y', 'z', 'xy', 'yz', 'xz', 'xyz'], default: 'y' },
        { name: 'angle', type: 'number', label: 'Angle (degrees)', default: 360 },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 2000 },
        { name: 'easing', type: 'select', label: 'Easing', options: ['linear', 'easeInOutSine', 'easeInOutCubic'], default: 'linear' },
        { name: 'loop', type: 'number', label: 'Loop Count (0=forever)', default: 0 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const axis = params.axis || 'y';
        const angle = params.angle || 360;
        const duration = params.duration || 2000;
        const easing = params.easing || 'linear';
        const loop = params.loop || 0;
        const props = {};
        if (axis.includes('x')) props.rotationX = angle;
        if (axis.includes('y')) props.rotationY = angle;
        if (axis.includes('z')) props.rotationZ = angle;
        const propsStr = Object.keys(props).join(': ').replace(/,/g, ', ');
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D, ${propsStr}, duration: ${duration}, easing: '${easing}', loop: ${loop === 0 ? 'true' : loop} }); }`;
      }
    },
    'anime-scale': {
      name: 'Scale',
      icon: 'fa-expand',
      category: 'Anime.js',
      description: 'Scale animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'scaleX', type: 'number', label: 'Scale X', default: 1.5 },
        { name: 'scaleY', type: 'number', label: 'Scale Y', default: 1.5 },
        { name: 'scaleZ', type: 'number', label: 'Scale Z', default: 1.5 },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 },
        { name: 'easing', type: 'select', label: 'Easing', options: ['easeInOutBack', 'easeInOutQuad', 'easeOutElastic', 'spring'], default: 'easeInOutBack' },
        { name: 'direction', type: 'select', label: 'Direction', options: ['normal', 'alternate'], default: 'alternate' },
        { name: 'loop', type: 'number', label: 'Loop Count (0=forever)', default: 0 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const scaleX = params.scaleX || 1.5;
        const scaleY = params.scaleY || 1.5;
        const scaleZ = params.scaleZ || 1.5;
        const duration = params.duration || 500;
        const easing = params.easing || 'easeInOutBack';
        const direction = params.direction || 'alternate';
        const loop = params.loop || 0;
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D, scaleX: ${scaleX}, scaleY: ${scaleY}, scaleZ: ${scaleZ}, duration: ${duration}, easing: '${easing}', direction: '${direction}', loop: ${loop === 0 ? 'true' : loop} }); }`;
      }
    },
    'anime-color': {
      name: 'Color Change',
      icon: 'fa-palette',
      category: 'Anime.js',
      description: 'Animate color change',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'color', type: 'text', label: 'Target Color (#hex)', default: '#FF0000' },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 },
        { name: 'easing', type: 'select', label: 'Easing', options: ['easeInOutSine', 'easeInOutQuad', 'linear'], default: 'easeInOutSine' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const color = params.color || '#FF0000';
        const duration = params.duration || 500;
        const easing = params.easing || 'easeInOutSine';
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.getAttribute('material') || {}, color: '${color}', duration: ${duration}, easing: '${easing}', update: function(anim) { el.setAttribute('material', 'color', anim.animations[0].value); } }); }`;
      }
    },
    'anime-move': {
      name: 'Move To',
      icon: 'fa-arrows-alt',
      category: 'Anime.js',
      description: 'Move to position',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'positionX', type: 'number', label: 'Position X', default: 0 },
        { name: 'positionY', type: 'number', label: 'Position Y', default: 1 },
        { name: 'positionZ', type: 'number', label: 'Position Z', default: -3 },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 1000 },
        { name: 'easing', type: 'select', label: 'Easing', options: ['easeInOutQuad', 'easeOutCubic', 'spring', 'easeOutElastic'], default: 'easeInOutQuad' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const x = params.positionX || 0;
        const y = params.positionY || 1;
        const z = params.positionZ || -3;
        const duration = params.duration || 1000;
        const easing = params.easing || 'easeInOutQuad';
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D.position, x: ${x}, y: ${y}, z: ${z}, duration: ${duration}, easing: '${easing}' }); }`;
      }
    },
    'anime-wiggle': {
      name: 'Wiggle',
      icon: 'fa-random',
      category: 'Anime.js',
      description: 'Wiggle animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'amount', type: 'number', label: 'Wiggle Amount', default: 10 },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 300 },
        { name: 'loop', type: 'number', label: 'Loop Count (0=forever)', default: 3 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const amount = params.amount || 10;
        const duration = params.duration || 300;
        const loop = params.loop || 3;
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D.rotation, x: anime(${amount} * (Math.PI / 180)), duration: ${duration}, direction: 'alternate', loop: ${loop}, easing: 'easeInOutSine' }); }`;
      }
    },
    'anime-spin': {
      name: 'Spin',
      icon: 'fa-redo',
      category: 'Anime.js',
      description: 'Continuous spin animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'speed', type: 'select', label: 'Speed', options: ['slow', 'normal', 'fast'], default: 'normal' },
        { name: 'direction', type: 'select', label: 'Direction', options: ['clockwise', 'counterclockwise'], default: 'clockwise' }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const speedMap = { slow: 8000, normal: 3000, fast: 1000 };
        const duration = speedMap[params.speed] || 3000;
        const direction = params.direction === 'counterclockwise' ? -1 : 1;
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D.rotation, y: ${direction} * Math.PI * 2, duration: ${duration}, easing: 'linear', loop: true }); }`;
      }
    },
    'anime-bounce': {
      name: 'Bounce',
      icon: 'fa-bounce',
      category: 'Anime.js',
      description: 'Bounce animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'height', type: 'number', label: 'Bounce Height', default: 0.5 },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 },
        { name: 'loop', type: 'number', label: 'Loop Count (0=forever)', default: 3 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const height = params.height || 0.5;
        const duration = params.duration || 500;
        const loop = params.loop || 3;
        return `var el = ${target}; if (typeof anime !== 'undefined') { var originalY = el.object3D.position.y; anime({ targets: el.object3D.position, y: originalY + ${height}, duration: ${duration}, direction: 'alternate', loop: ${loop}, easing: 'easeOutQuad' }); }`;
      }
    },
    'anime-fade': {
      name: 'Fade',
      icon: 'fa-adjust',
      category: 'Anime.js',
      description: 'Fade in/out animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'mode', type: 'select', label: 'Mode', options: ['fadeIn', 'fadeOut'], default: 'fadeIn' },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const mode = params.mode || 'fadeIn';
        const duration = params.duration || 500;
        if (mode === 'fadeIn') {
          return `var el = ${target}; if (typeof anime !== 'undefined') { el.setAttribute('visible', true); anime({ targets: el.object3D.material, opacity: 1, duration: ${duration}, easing: 'linear' }); }`;
        } else {
          return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D.material, opacity: 0, duration: ${duration}, easing: 'linear', complete: function() { el.setAttribute('visible', false); } }); }`;
        }
      }
    },
    'anime-shake': {
      name: 'Shake',
      icon: 'fa-exclamation-triangle',
      category: 'Anime.js',
      description: 'Shake animation',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'intensity', type: 'select', label: 'Intensity', options: ['light', 'normal', 'strong'], default: 'normal' },
        { name: 'loop', type: 'number', label: 'Loop Count', default: 2 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const intensityMap = { light: 5, normal: 10, strong: 20 };
        const intensity = intensityMap[params.intensity] || 10;
        const loop = params.loop || 2;
        return `var el = ${target}; if (typeof anime !== 'undefined') { anime({ targets: el.object3D.position, x: [${intensity}, -${intensity}], duration: 50, loop: ${loop * 2}, direction: 'alternate', easing: 'linear' }); }`;
      }
    },

    // Trigger Custom Event (for animation chaining)
    'trigger-event': {
      name: 'Trigger Custom Event',
      icon: 'fa-bolt',
      category: 'Anime.js',
      description: 'Trigger a custom event for animation chaining',
      params: [
        { name: 'event', type: 'select', label: 'Trigger Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'customEvent', type: 'select', label: 'Custom Event', options: CUSTOM_EVENT_TYPES, default: 'custom-click' },
        { name: 'delay', type: 'number', label: 'Delay (ms)', default: 0 }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const customEvent = params.customEvent || 'custom-click';
        const delay = params.delay || 0;
        return `var el = ${target}; setTimeout(function() { el.emit('${customEvent}'); }, ${delay});`;
      }
    },

    // Call JavaScript Function
    'call-javascript': {
      name: 'Call JavaScript',
      icon: 'fa-code',
      category: 'Advanced',
      description: 'Execute custom JavaScript function',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Element', default: '' },
        { name: 'functionName', type: 'text', label: 'Function Name', default: '' },
        { name: 'parameters', type: 'textarea', label: 'Parameters (JSON)', default: '{}' },
        { name: 'useElement', type: 'checkbox', label: 'Pass element as parameter', default: true }
      ],
      generate: (params) => {
        const target = params.target || 'this.el';
        const funcName = params.functionName || '';
        const params_ = params.parameters || '{}';
        const useElement = params.useElement;
        
        if (!funcName) {
          return `// No function name specified`;
        }
        
        // Try to call the function with optional element and custom parameters
        return `var el = ${target}; var func = window['${funcName}']; if (typeof func === 'function') { func(el, ${params_}); } else { console.warn('Function ${funcName} not found'); }`;
      }
    }
  };

  /**
   * Get all behaviors grouped by category
   */
  static getBehaviorsByCategory() {
    const categories = {};
    for (const [key, behavior] of Object.entries(BehaviorsManager.BEHAVIORS)) {
      if (!categories[behavior.category]) {
        categories[behavior.category] = [];
      }
      categories[behavior.category].push({ key, ...behavior });
    }
    return categories;
  }

  /**
   * Apply behavior to entity
   * @param {HTMLElement} entity - The A-Frame entity
   * @param {string} behaviorName - The behavior key
   * @param {Object} params - Behavior parameters
   * @returns {string} The component name that was registered
   */
  applyBehavior(entity, behaviorName, params = {}) {
    const behavior = BehaviorsManager.BEHAVIORS[behaviorName];
    if (!behavior) {
      console.error(`Behavior "${behaviorName}" not found`);
      return null;
    }

    const code = behavior.generate(params);
    const eventType = params.event || 'click';
    const componentName = `behavior-${behaviorName}-${Date.now()}`;

    // Register as A-Frame component
    AFRAME.registerComponent(componentName, {
      init: function () {
        const el = this.el;
        const behaviorEvent = eventType;

        el.addEventListener(behaviorEvent, function () {
          try {
            const fn = new Function('el', code);
            fn.call({ el: el }, el);
          } catch (e) {
            console.error('Behavior error:', e);
          }
        });
      }
    });

    // Add component to entity
    entity.setAttribute(componentName, '');

    // Store the behavior with a unique ID
    const behaviorId = Date.now();
    if (!this.behaviors.has(entity)) {
      this.behaviors.set(entity, []);
    }
    this.behaviors.get(entity).push({
      id: behaviorId,
      name: behaviorName,
      componentName: componentName,
      params: params,
      behavior: behavior
    });

    // Emit event for UI update
    Events.emit('behavioradd', {
      entity: entity,
      behaviorName: behaviorName,
      componentName: componentName,
      behaviorId: behaviorId
    });

    return componentName;
  }

  /**
   * Update an existing behavior's parameters
   * @param {HTMLElement} entity - The A-Frame entity
   * @param {number} behaviorId - The behavior ID
   * @param {Object} newParams - New parameters
   */
  updateBehavior(entity, behaviorId, newParams) {
    const entityBehaviors = this.behaviors.get(entity);
    if (!entityBehaviors) return false;

    const behaviorIndex = entityBehaviors.findIndex(b => b.id === behaviorId);
    if (behaviorIndex === -1) return false;

    const oldBehavior = entityBehaviors[behaviorIndex];
    const behaviorName = oldBehavior.name;
    const behavior = BehaviorsManager.BEHAVIORS[behaviorName];

    if (!behavior) return false;

    // Remove old component
    entity.removeAttribute(oldBehavior.componentName);

    // Generate new component name and code
    const code = behavior.generate(newParams);
    const eventType = newParams.event || 'click';
    const newComponentName = `behavior-${behaviorName}-${Date.now()}`;

    // Register new A-Frame component
    AFRAME.registerComponent(newComponentName, {
      init: function () {
        const el = this.el;
        el.addEventListener(eventType, function () {
          try {
            const fn = new Function('el', code);
            fn.call({ el: el }, el);
          } catch (e) {
            console.error('Behavior error:', e);
          }
        });
      }
    });

    // Add new component to entity
    entity.setAttribute(newComponentName, '');

    // Update stored behavior
    entityBehaviors[behaviorIndex] = {
      ...oldBehavior,
      componentName: newComponentName,
      params: newParams
    };

    // Emit event for UI update
    Events.emit('behaviorupdate', {
      entity: entity,
      behaviorId: behaviorId
    });

    return true;
  }

  /**
   * Remove a behavior from an entity
   * @param {HTMLElement} entity - The A-Frame entity
   * @param {string} componentName - The behavior component name
   */
  removeBehavior(entity, componentName) {
    if (!entity) return;

    // Remove the component from entity
    entity.removeAttribute(componentName);

    // Remove from our tracking
    const entityBehaviors = this.behaviors.get(entity);
    if (entityBehaviors) {
      const index = entityBehaviors.findIndex(b => b.componentName === componentName);
      if (index > -1) {
        entityBehaviors.splice(index, 1);
      }
      if (entityBehaviors.length === 0) {
        this.behaviors.delete(entity);
      }
    }

    // Emit event for UI update
    Events.emit('behaviorremove', {
      entity: entity,
      componentName: componentName
    });
  }

  /**
   * Get all behaviors for an entity
   * @param {HTMLElement} entity - The A-Frame entity
   * @returns {Array} Array of behavior objects
   */
  getBehaviorsForEntity(entity) {
    return this.behaviors.get(entity) || [];
  }

  /**
   * Check if entity has any behaviors
   * @param {HTMLElement} entity - The A-Frame entity
   * @returns {boolean}
   */
  hasBehaviors(entity) {
    const behaviors = this.behaviors.get(entity);
    return behaviors && behaviors.length > 0;
  }

  /**
   * Get behavior parameters for a specific behavior
   * @param {string} behaviorName - The behavior key
   * @returns {Array} Array of parameter definitions
   */
  static getBehaviorParams(behaviorName) {
    const behavior = BehaviorsManager.BEHAVIORS[behaviorName];
    return behavior ? behavior.params : [];
  }

  /**
   * Get help information for a behavior
   * @param {string} behaviorName - The behavior key
   * @returns {Object} Help object with description, examples, and generated code
   */
  static getBehaviorHelp(behaviorName) {
    return BEHAVIOR_HELP[behaviorName] || {
      description: 'No help available for this behavior.',
      examples: [],
      generatedCode: ''
    };
  }

  /**
   * Generate behavior code for export
   * @param {HTMLElement} entity - The A-Frame entity
   * @returns {string} Generated JavaScript code
   */
  generateBehaviorCode(entity) {
    const entityBehaviors = this.behaviors.get(entity);
    if (!entityBehaviors || entityBehaviors.length === 0) {
      return '';
    }

    let code = '\n<script>\n';

    entityBehaviors.forEach(behavior => {
      const behaviorDef = BehaviorsManager.BEHAVIORS[behavior.name];
      if (behaviorDef) {
        const generatedCode = behaviorDef.generate(behavior.params);
        const eventType = behavior.params.event || 'click';
        code += `  AFRAME.registerComponent('${behavior.componentName}', {\n`;
        code += `    init: function() {\n`;
        code += `      this.el.addEventListener('${eventType}', () => {\n`;
        code += `        try {\n`;
        code += `          ${generatedCode}\n`;
        code += `        } catch(e) { console.error('Behavior error:', e); }\n`;
        code += `      });\n`;
        code += `    }\n`;
        code += `  });\n\n`;
      }
    });

    code += '<\/script>\n';
    return code;
  }
}

// Export singleton instance
const behaviorsManager = new BehaviorsManager();
export default behaviorsManager;
export { BehaviorsManager };
