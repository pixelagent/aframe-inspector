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
    description: 'Shows a browser dialog with your message. Use alert for notifications, prompt for user input, or confirm for yes/no questions.',
    examples: [
      'Alert: Type = alert, Message = Welcome to our site!',
      'Prompt: Type = prompt, Message = What is your name?, Default Value = John',
      'Confirm: Type = confirm, Message = Are you sure?'
    ],
    generatedCode: `// Alert\nalert('Hello World!');\n\n// Prompt\nvar name = prompt('What is your name?', 'John');\n\n// Confirm\nvar confirmed = confirm('Are you sure?');`
  },
  'set-status-bar': {
    description: 'Sets the browser status bar text.',
    examples: ['Show loading status: Status Text = Loading...'],
    generatedCode: `window.status = 'Loading...';`
  },
  'set-text': {
    description: 'Changes the text content of an element. Use {{variableName}} to insert variables.',
    examples: [
      'Static text: Selector = #myText, Text = Hello World',
      'With variable: Text = Score: {{score}} (displays value of window.score)',
      'Multiple: Text = Player: {{playerName}} Score: {{score}}',
      'With Get Random: Use Get Random to set damage, then Set Text to show "Damage: {{damage}}"'
    ],
    generatedCode: `// Set text with variable interpolation\nvar text = 'Score: ' + (window.score || 0);\ndocument.querySelector('#scoreDisplay').setAttribute('text', 'value', text);`
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
  },
  'change-variable': {
    description: 'Changes a numeric variable by adding or subtracting a value. Useful for score, health, or currency systems.',
    examples: [
      'Increase score: Variable = score, Change = 10, Operation = add',
      'Decrease health: Variable = health, Change = 5, Operation = subtract',
      'Reset counter: Variable = counter, Change = 0, Operation = set'
    ],
    generatedCode: `// Example: Increase score by 10\nwindow.score = (window.score || 0) + 10;\nconsole.log('Score:', window.score);`
  },
  'condition': {
    description: 'Checks a condition (e.g., score > 10) and triggers different events based on whether it is true or false. Use with other behaviors to create game logic.',
    examples: [
      'Score check: Variable = score, Operator = >, Value = 10, On True Event = win-game',
      'Health check: Variable = health, Operator = <=, Value = 0, On True Event = game-over, On False Event = continue'
    ],
    generatedCode: `// If score > 10, trigger win-game event\nvar val = window.score || 0;\nif (val > 10) { el.emit('win-game'); }`
  },
  'get-random': {
    description: 'Generates a random number between min and max and stores it in a variable. Use for damage rolls, random rewards, etc.',
    examples: [
      'Dice roll: Minimum = 1, Maximum = 6, Store As = diceRoll',
      'Damage: Minimum = 5, Maximum = 10, Store As = damage'
    ],
    generatedCode: `// Generate random number between 1 and 10\nwindow.randomNumber = Math.floor(Math.random() * 10) + 1;\nconsole.log('Random:', window.randomNumber);`
  },
  'random-event': {
    description: 'Triggers an event based on a percentage chance. Useful for random loot, critical hits, or spawns.',
    examples: [
      '10% chance: Chance = 10, On Success Event = spawn-enemy',
      '50% chance: Chance = 50, On Success Event = double-points'
    ],
    generatedCode: `// 10% chance to trigger event\nif (Math.random() * 100 < 10) {\n  el.emit('random-event');\n}`
  },
  'game-save': {
    description: 'Saves game data to browser localStorage for persistent storage.',
    examples: [
      'Save score: Key = gameScore, Value = score',
      'Save position: Key = playerPos, Value = #player'
    ],
    generatedCode: `// Save to localStorage\nlocalStorage.setItem('gameScore', window.score);`
  },
  'game-load': {
    description: 'Loads game data from browser localStorage.',
    examples: [
      'Load score: Key = gameScore, Variable = score',
      'Load position: Key = playerPos, Target = #player'
    ],
    generatedCode: `// Load from localStorage\nvar data = JSON.parse(localStorage.getItem('gameData'));\nwindow.score = data ? data.score : 0;`
  },
  'distance-check': {
    description: 'Triggers an event when one entity is within a certain distance of another. Useful for proximity triggers.',
    examples: [
      'Player in range: Target1 = #player, Target2 = #treasure, Distance = 3, In Range Event = show-prompt',
      'Enemy detection: Target1 = #player, Target2 = #enemy, Distance = 5, In Range Event = alert-enemy'
    ],
    generatedCode: `// Check if player is within 5 units of treasure\nvar pos1 = player.object3D.getWorldPosition(new THREE.Vector3());\nvar pos2 = treasure.object3D.getWorldPosition(new THREE.Vector3());\nif (pos1.distanceTo(pos2) < 5) { el.emit('in-range'); }`
  },
  'random-pick': {
    description: 'Picks a random item from a list and stores it in a variable. Useful for random loot or choices.',
    examples: [
      'Random loot: Items = Sword, Shield, Potion, Gold, Store As = loot',
      'Random enemy: Items = goblin, skeleton, orc, Store As = spawnedEnemy'
    ],
    generatedCode: `// Pick random item from list\nvar items = ['Sword', 'Shield', 'Potion', 'Gold'];\nwindow.loot = items[Math.floor(Math.random() * items.length)];\nconsole.log('Picked:', window.loot);`
  },
  'get-distance': {
    description: 'Calculates the distance between two entities and stores it in a variable.',
    examples: [
      'Player to enemy: Target1 = #player, Target2 = #enemy, Store As = distToEnemy',
      'Object to target: Target1 = this element, Target2 = #goal, Store As = distanceLeft'
    ],
    generatedCode: `// Get distance between player and goal\nvar pos1 = player.object3D.getWorldPosition(new THREE.Vector3());\nvar pos2 = goal.object3D.getWorldPosition(new THREE.Vector3());\nwindow.distanceLeft = pos1.distanceTo(pos2);`
  },
  'look-at': {
    description: 'Makes the entity face/look at another entity. Useful for turrets, NPCs, or cameras.',
    examples: [
      'Turret aiming: Target = #player, Smooth = unchecked',
      'Smooth follow: Target = #player, Smooth = checked, Duration = 500'
    ],
    generatedCode: `// Make turret face player\nel.object3D.lookAt(target.object3D.position);`
  },
  'lerp-position': {
    description: 'Smoothly interpolates the entity position toward a target. Creates smooth movement effects.',
    examples: [
      'Follow player: Target = #player, Speed = 0.1',
      'Move to point: Target = #checkpoint, Speed = 0.05, On Complete Event = arrived'
    ],
    generatedCode: `// Smoothly move toward target\nel.object3D.position.lerp(target.object3D.position, 0.1);`
  },
  'format-time': {
    description: 'Converts a number of seconds into MM:SS format string. Useful for timers.',
    examples: [
      'Format timer: Seconds Variable = timer, Output Variable = formattedTime',
      'Format elapsed: Seconds Variable = elapsed, Output Variable = displayTime'
    ],
    generatedCode: `// Convert 95 seconds to 1:35\nvar s = window.timer || 0;\nvar m = Math.floor(s / 60);\nvar sec = Math.floor(s % 60);\nwindow.formattedTime = m + ':' + (sec < 10 ? '0' : '') + sec;`
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
      description: 'Show alert, prompt, or confirm dialog',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'type', type: 'select', label: 'Dialog Type', options: ['alert', 'prompt', 'confirm'], default: 'alert' },
        { name: 'message', type: 'textarea', label: 'Message', default: 'Hello World!' },
        { name: 'defaultValue', type: 'text', label: 'Default Value (for prompt)', default: '' }
      ],
      generate: (params) => {
        const type = params.type || 'alert';
        const message = (params.message || 'Hello World!').replace(/'/g, "\\'");
        const defaultValue = params.defaultValue || '';

        if (type === 'prompt') {
          return `prompt('${message}', '${defaultValue}');`;
        } else if (type === 'confirm') {
          return `confirm('${message}');`;
        } else {
          return `alert('${message}');`;
        }
      }
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
      description: 'Replace element text (use {{variable}} for variables)',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'selector', type: 'text', label: 'Element Selector', default: '' },
        { name: 'text', type: 'textarea', label: 'New Text', default: '' }
      ],
      generate: (params) => {
        const selector = params.selector || '';
        const text = params.text || '';

        // Check if text contains variable interpolation {{variable}}
        if (text.includes('{{')) {
          // Generate code that interpolates variables at runtime
          return `var text = '${text.replace(/'/g, "\\'")}'.replace(/\\{\\{(\\w+)\\}\\}/g, function(match, varName) { return window[varName] || ''; });\n` +
            `var el = document.querySelector('${selector}'); if (el) { el.setAttribute('text', 'value', text); }`;
        } else {
          return `var el = document.querySelector('${selector}'); if (el) { el.setAttribute('text', 'value', '${text}'); }`;
        }
      }
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

    // Game Behaviors
    'get-random': {
      name: 'Get Random Number',
      icon: 'fa-dice',
      category: 'Game',
      description: 'Generate a random number and store in a variable',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'min', type: 'number', label: 'Minimum', default: 1 },
        { name: 'max', type: 'number', label: 'Maximum', default: 10 },
        { name: 'variableName', type: 'text', label: 'Store Result As', default: 'randomNumber' }
      ],
      generate: (params) => {
        const min = params.min || 1;
        const max = params.max || 10;
        const varName = params.variableName || 'randomNumber';
        return `window.${varName} = Math.floor(Math.random() * (${max} - ${min} + 1)) + ${min};\nconsole.log('${varName}:', window.${varName});`;
      }
    },
    'condition': {
      name: 'Check Condition',
      icon: 'fa-question-circle',
      category: 'Game',
      description: 'Check a condition and trigger different events based on true/false',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'variable', type: 'text', label: 'Variable', default: 'score' },
        { name: 'operator', type: 'select', label: 'Operator', options: ['==', '!=', '>', '<', '>=', '<='], default: '>' },
        { name: 'value', type: 'text', label: 'Value', default: '10' },
        { name: 'onTrue', type: 'text', label: 'On True Event', default: 'condition-met' },
        { name: 'onFalse', type: 'text', label: 'On False Event', default: '' }
      ],
      generate: (params) => {
        const variable = params.variable || 'score';
        const operator = params.operator || '>';
        const value = params.value || '10';
        const onTrue = params.onTrue || 'condition-met';
        const onFalse = params.onFalse || '';

        let code = `var val = window.${variable} || 0;\n`;
        code += `var compareVal = ${isNaN(value) ? `'${value}'` : value};\n`;
        code += `var result = false;\n`;

        switch (operator) {
          case '==':
            code += `result = val == compareVal;`;
            break;
          case '!=':
            code += `result = val != compareVal;`;
            break;
          case '>':
            code += `result = val > compareVal;`;
            break;
          case '<':
            code += `result = val < compareVal;`;
            break;
          case '>=':
            code += `result = val >= compareVal;`;
            break;
          case '<=':
            code += `result = val <= compareVal;`;
            break;
        }

        code += `\nif (result) { el.emit('${onTrue}'); }`;
        if (onFalse) {
          code += ` else { el.emit('${onFalse}'); }`;
        }

        return code;
      }
    },
    'change-variable': {
      name: 'Change Variable',
      icon: 'fa-plus-minus',
      category: 'Game',
      description: 'Add, subtract, or set a numeric variable',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'variableName', type: 'text', label: 'Variable Name', default: 'score' },
        { name: 'amount', type: 'number', label: 'Amount', default: 1 },
        { name: 'operation', type: 'select', label: 'Operation', options: ['add', 'subtract', 'set', 'multiply', 'divide'], default: 'add' },
        { name: 'minValue', type: 'number', label: 'Minimum Value (optional)', default: '' },
        { name: 'maxValue', type: 'number', label: 'Maximum Value (optional)', default: '' }
      ],
      generate: (params) => {
        const varName = params.variableName || 'score';
        const amount = params.amount || 1;
        const operation = params.operation || 'add';
        const minVal = params.minValue !== '' ? params.minValue : null;
        const maxVal = params.maxValue !== '' ? params.maxValue : null;

        let code = `window.${varName} = window.${varName} || 0;\n`;

        switch (operation) {
          case 'add':
            code += `window.${varName} += ${amount};`;
            break;
          case 'subtract':
            code += `window.${varName} -= ${amount};`;
            break;
          case 'set':
            code += `window.${varName} = ${amount};`;
            break;
          case 'multiply':
            code += `window.${varName} *= ${amount};`;
            break;
          case 'divide':
            code += `window.${varName} = window.${varName} / ${amount};`;
            break;
        }

        if (minVal !== null && maxVal !== null) {
          code += `\nwindow.${varName} = Math.min(Math.max(window.${varName}, ${minVal}), ${maxVal});`;
        } else if (minVal !== null) {
          code += `\nwindow.${varName} = Math.max(window.${varName}, ${minVal});`;
        } else if (maxVal !== null) {
          code += `\nwindow.${varName} = Math.min(window.${varName}, ${maxVal});`;
        }

        code += `\nconsole.log('${varName}:', window.${varName});`;
        return code;
      }
    },
    'random-event': {
      name: 'Random Event',
      icon: 'fa-dice',
      category: 'Game',
      description: 'Trigger an event based on percentage chance',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'chance', type: 'number', label: 'Chance (%)', default: 10 },
        { name: 'successEvent', type: 'text', label: 'Success Event Name', default: 'random-success' },
        { name: 'failEvent', type: 'text', label: 'Fail Event Name (optional)', default: '' }
      ],
      generate: (params) => {
        const chance = params.chance || 10;
        const successEvent = params.successEvent || 'random-success';
        const failEvent = params.failEvent || '';

        let code = `if (Math.random() * 100 < ${chance}) {\n`;
        code += `  el.emit('${successEvent}');\n`;
        code += `  console.log('Random event triggered! (${chance}% chance)');\n`;
        code += `}`;

        if (failEvent) {
          code += ` else {\n  el.emit('${failEvent}');\n}`;
        }

        return code;
      }
    },
    'game-save': {
      name: 'Save Game',
      icon: 'fa-save',
      category: 'Game',
      description: 'Save variable to browser localStorage',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'key', type: 'text', label: 'Storage Key', default: 'gameData' },
        { name: 'variableName', type: 'text', label: 'Variable to Save', default: 'score' }
      ],
      generate: (params) => {
        const key = params.key || 'gameData';
        const varName = params.variableName || 'score';
        return `localStorage.setItem('${key}', JSON.stringify({ ${varName}: window.${varName} }));\nconsole.log('Game saved!');`;
      }
    },
    'game-load': {
      name: 'Load Game',
      icon: 'fa-folder-open',
      category: 'Game',
      description: 'Load variable from browser localStorage',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'key', type: 'text', label: 'Storage Key', default: 'gameData' },
        { name: 'variableName', type: 'text', label: 'Variable to Load', default: 'score' },
        { name: 'defaultValue', type: 'number', label: 'Default Value', default: 0 }
      ],
      generate: (params) => {
        const key = params.key || 'gameData';
        const varName = params.variableName || 'score';
        const defaultValue = params.defaultValue || 0;
        return `var data = JSON.parse(localStorage.getItem('${key}'));\nwindow.${varName} = data ? data.${varName} : ${defaultValue};\nconsole.log('${varName} loaded:', window.${varName});`;
      }
    },
    'distance-check': {
      name: 'Distance Check',
      icon: 'fa-ruler',
      category: 'Game',
      description: 'Trigger event when target is within distance of another entity',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target1', type: 'entity', label: 'First Element', default: '' },
        { name: 'target2', type: 'entity', label: 'Second Element', default: '' },
        { name: 'distance', type: 'number', label: 'Distance', default: 5 },
        { name: 'inRangeEvent', type: 'text', label: 'In Range Event', default: 'in-range' },
        { name: 'outRangeEvent', type: 'text', label: 'Out of Range Event', default: '' }
      ],
      generate: (params) => {
        const t1 = params.target1 || 'this.el';
        const t2 = params.target2 || '';
        const dist = params.distance || 5;
        const inEvent = params.inRangeEvent || 'in-range';
        const outEvent = params.outRangeEvent || '';

        let code = `var el1 = ${t1};\n`;
        code += `var el2 = document.querySelector('${t2}');\n`;
        code += `if (!el2) return;\n`;
        code += `var pos1 = new THREE.Vector3();\n`;
        code += `var pos2 = new THREE.Vector3();\n`;
        code += `el1.object3D.getWorldPosition(pos1);\n`;
        code += `el2.object3D.getWorldPosition(pos2);\n`;
        code += `var d = pos1.distanceTo(pos2);\n`;
        code += `if (d < ${dist}) { el1.emit('${inEvent}'); }`;

        if (outEvent) {
          code += ` else { el1.emit('${outEvent}'); }`;
        }

        return code;
      }
    },
    'random-pick': {
      name: 'Random Pick',
      icon: 'fa-random',
      category: 'Game',
      description: 'Pick a random item from a list and trigger event',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'items', type: 'textarea', label: 'Items (comma separated)', default: 'item1, item2, item3' },
        { name: 'variableName', type: 'text', label: 'Store Result As', default: 'pickedItem' }
      ],
      generate: (params) => {
        const items = params.items || 'item1, item2, item3';
        const varName = params.variableName || 'pickedItem';
        const itemArray = items.split(',').map(s => `'${s.trim()}'`).join(', ');
        return `var items = [${itemArray}];\nwindow.${varName} = items[Math.floor(Math.random() * items.length)];\nconsole.log('Picked:', window.${varName});`;
      }
    },
    'get-distance': {
      name: 'Get Distance',
      icon: 'fa-ruler-horizontal',
      category: 'Game',
      description: 'Calculate distance between two entities and store in variable',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target1', type: 'entity', label: 'First Element', default: '' },
        { name: 'target2', type: 'entity', label: 'Second Element', default: '' },
        { name: 'variableName', type: 'text', label: 'Store Distance As', default: 'distance' }
      ],
      generate: (params) => {
        const t1 = params.target1 || 'this.el';
        const t2 = params.target2 || '';
        const varName = params.variableName || 'distance';

        let code = `var el1 = ${t1};\n`;
        code += `var el2 = document.querySelector('${t2}');\n`;
        code += `if (!el2) return;\n`;
        code += `var pos1 = new THREE.Vector3();\n`;
        code += `var pos2 = new THREE.Vector3();\n`;
        code += `el1.object3D.getWorldPosition(pos1);\n`;
        code += `el2.object3D.getWorldPosition(pos2);\n`;
        code += `window.${varName} = pos1.distanceTo(pos2);\n`;
        code += `console.log('Distance:', window.${varName}.toFixed(2));`;

        return code;
      }
    },
    'look-at': {
      name: 'Look At',
      icon: 'fa-eye',
      category: 'Game',
      description: 'Make entity face another entity',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target to Face', default: '' },
        { name: 'smooth', type: 'checkbox', label: 'Smooth Animation', default: false },
        { name: 'duration', type: 'number', label: 'Duration (ms)', default: 500 }
      ],
      generate: (params) => {
        const target = params.target || '';
        const smooth = params.smooth || false;
        const duration = params.duration || 500;

        if (smooth) {
          return `var el = this.el;\nvar target = document.querySelector('${target}');\nif (!target) return;\nel.object3D.lookAt(target.object3D.position);`;
        } else {
          return `var el = this.el;\nvar target = document.querySelector('${target}');\nif (!target) return;\nvar targetPos = target.object3D.position;\nvar lookPos = new THREE.Vector3(targetPos.x, el.object3D.position.y, targetPos.z);\nel.object3D.lookAt(lookPos);`;
        }
      }
    },
    'lerp-position': {
      name: 'Lerp Position',
      icon: 'fa-arrows-alt-h',
      category: 'Game',
      description: 'Smoothly move entity toward target position',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'target', type: 'entity', label: 'Target Position', default: '' },
        { name: 'speed', type: 'number', label: 'Speed (0-1)', default: 0.1 },
        { name: 'onComplete', type: 'text', label: 'On Complete Event', default: '' }
      ],
      generate: (params) => {
        const target = params.target || '';
        const speed = params.speed || 0.1;
        const completeEvent = params.onComplete || '';

        let code = `var el = this.el;\n`;
        code += `var target = document.querySelector('${target}');\n`;
        code += `if (!target) return;\n`;
        code += `var startPos = el.object3D.position.clone();\n`;
        code += `var endPos = target.object3D.position.clone();\n`;
        code += `var alpha = ${speed};\n`;
        code += `el.object3D.position.lerp(endPos, alpha);\n`;

        if (completeEvent) {
          code += `if (startPos.distanceTo(endPos) < 0.1) { el.emit('${completeEvent}'); }`;
        }

        return code;
      }
    },
    'format-time': {
      name: 'Format Time',
      icon: 'fa-clock',
      category: 'Game',
      description: 'Convert seconds to MM:SS format',
      params: [
        { name: 'event', type: 'select', label: 'Event', options: EVENT_TYPES, default: 'click' },
        { name: 'secondsVariable', type: 'text', label: 'Seconds Variable', default: 'timer' },
        { name: 'outputVariable', type: 'text', label: 'Output Variable', default: 'formattedTime' }
      ],
      generate: (params) => {
        const secondsVar = params.secondsVariable || 'timer';
        const outputVar = params.outputVariable || 'formattedTime';

        return `var s = window.${secondsVar} || 0;\n` +
          `var m = Math.floor(s / 60);\n` +
          `var sec = Math.floor(s % 60);\n` +
          `window.${outputVar} = m + ':' + (sec < 10 ? '0' : '') + sec;\n` +
          `console.log('Time:', window.${outputVar});`;
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
