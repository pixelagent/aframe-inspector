/**
 * Beginner-friendly configuration for A-Frame components
 * Defines which properties to show by default and tooltip descriptions
 */

export const componentHelp = {
  // Material component help text
  material: {
    beginner: ['color', 'opacity', 'src', 'shader'],
    descriptions: {
      color: 'The color of the object (e.g., red, #FF0000, rgb(255,0,0))',
      opacity: 'How transparent the object is (0 = invisible, 1 = fully visible)',
      src: 'Image texture to use on the object surface',
      shader: 'How the material is rendered (flat = flat color, standard = realistic lighting)',
      metalness: 'How metallic the surface looks (0 = non-metal, 1 = fully metallic)',
      roughness: 'How rough the surface looks (0 = smooth/shiny, 1 = rough/matte)',
      emissive: 'The color the object emits when exposed to light',
      emissiveIntensity: 'How strongly the object emits light',
      wireframe: 'Show the object as a wireframe (useful for debugging)',
      wireframeLinewidth: 'Thickness of wireframe lines',
      transparent: 'Enable transparency rendering',
      depthWrite: 'Write to depth buffer (affects rendering order)',
      fog: 'Enable fog effect on this material',
      side: 'Which sides to render (front, back, or both)',
      normalMap: 'Texture that adds surface detail through fake lighting',
      normalScale: 'Intensity of the normal map effect',
      ambientOcclusionMap: 'Texture for ambient shadows in crevices',
      ambientOcclusionMapIntensity: 'Strength of ambient occlusion',
      displacementMap: 'Texture that actually moves vertices',
      displacementScale: 'How much vertices are displaced',
      envMap: 'Reflection from environment texture',
      fog: 'Whether material is affected by fog'
    }
  },

  // Geometry component help text
  geometry: {
    beginner: ['primitive', 'radius', 'radiusTubular', 'segmentsTubular', 'height', 'width', 'depth', 'segmentsHeight', 'segmentsWidth', 'segmentsRadial'],
    descriptions: {
      primitive: 'The shape type (box, sphere, cylinder, etc.)',
      radius: 'The radius of circular shapes (sphere, cylinder top/bottom)',
      radiusTop: 'Top radius of cylinder (for cone shapes)',
      radiusBottom: 'Bottom radius of cylinder (for cone shapes)',
      height: 'Vertical size of the shape',
      width: 'Horizontal width of the shape',
      depth: 'Depth (front-to-back) of the shape',
      radiusTubular: 'Radius of the tube (for torus shapes)',
      segmentsTubular: 'Number of segments around the tube',
      segmentsHeight: 'Number of vertical segments (more = smoother)',
      segmentsWidth: 'Number of horizontal segments (more = smoother)',
      segmentsRadial: 'Number of radial segments (more = smoother around)',
      thetaStart: 'Starting angle for partial shapes',
      thetaLength: 'Length of arc for partial shapes',
      arc: 'Arc angle for partial torus shapes',
      openEnded: 'Whether the cylinder has top/bottom caps',
      buffer: 'Whether to use buffered geometry (recommended)',
      skipCache: 'Skip geometry caching for dynamic shapes'
    }
  },

  // Common transform component help text
  position: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Horizontal position (left/right)',
      y: 'Vertical position (up/down)',
      z: 'Depth position (forward/backward)'
    }
  },

  rotation: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Rotation around horizontal axis (pitch)',
      y: 'Rotation around vertical axis (yaw)',
      z: 'Rotation around depth axis (roll)'
    }
  },

  scale: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Horizontal scale (1 = normal, 2 = double width)',
      y: 'Vertical scale (1 = normal, 2 = double height)',
      z: 'Depth scale (1 = normal, 2 = double depth)'
    }
  },

  // WASD Controls
  'wasd-controls': {
    beginner: ['acceleration', 'fly', 'wsAxis', 'adAxis'],
    descriptions: {
      acceleration: 'How fast you move (higher = faster)',
      fly: 'Enable flying mode (move up/down with keys)',
      wsAxis: 'Which axis for forward/backward (y = up/down)',
      adAxis: 'Which axis for left/right (y = up/down)',
      easing: 'Movement smoothing',
      enabled: 'Whether controls are active',
      flyEnabled: 'Enable flying mode',
      AdEnabled: 'Enable A/D keys',
      wsEnabled: 'Enable W/S keys'
    }
  },

  // Look Controls
  'look-controls': {
    beginner: ['enabled', 'pointerLockEnabled'],
    descriptions: {
      enabled: 'Whether look controls are active',
      pointerLockEnabled: 'Lock mouse cursor to screen (for immersive experience)',
      reverseMouseDrag: 'Reverse the mouse drag direction',
      reverseTouchDrag: 'Reverse touch drag direction',
      touchEnabled: 'Enable touch controls on mobile',
      magicWindowTrackingEnabled: 'Enable VR magic window tracking',
      hmdEnabled: 'Enable head-mounted display tracking'
    }
  },

  // Camera
  camera: {
    beginner: ['active', 'fov'],
    descriptions: {
      active: 'Make this the active camera (only one can be active)',
      fov: 'Field of view - how wide the camera sees (in degrees)',
      near: 'Nearest distance where objects are visible',
      far: 'Furthest distance where objects are visible',
      lookAt: 'Target position for camera to look at',
      aspect: 'Aspect ratio (usually auto-calculated)',
      zoom: 'Camera zoom level'
    }
  },

  // Cursor
  cursor: {
    beginner: ['raycaster', ' fuse', 'timeout'],
    descriptions: {
      raycaster: 'Objects the cursor can interact with',
      fuse: 'Click automatically after hovering (for gaze interaction)',
      timeout: 'Time to wait before fuse click (in ms)',
      mouseCursorStylesEnabled: 'Show different cursor on hover',
      rayOrigin: 'Where the ray starts (mouse = from mouse position)',
      geometry: 'Shape of the cursor visual',
      material: 'Material of the cursor visual',
      far: 'Maximum distance for raycasting',
      interval: 'Time between raycast checks (ms)'
    }
  },

  // Layer
  layer: {
    beginner: ['id', 'order'],
    descriptions: {
      id: 'Unique identifier for the layer',
      order: 'Render order (higher = on top)',
      parent: 'Parent layer ID for nesting',
      transparent: 'Layer has transparent objects',
      depthTest: 'Objects in layer test against each other',
      renderOrder: 'Manual render order override'
    }
  },

  // Laser Controls
  'laser-controls': {
    beginner: ['hand', 'raycaster'],
    descriptions: {
      hand: 'Which hand (left or right)',
      raycaster: 'Configuration for the laser beam',
      model: 'Show controller model',
      rayOrigin: 'Where laser ray starts',
      far: 'Maximum distance of laser',
      interval: 'Time between raycast updates',
      lineColor: 'Color of laser beam',
      lineOpacity: 'Transparency of laser beam'
    }
  },

  // Link
  link: {
    beginner: ['href', 'title'],
    descriptions: {
      href: 'URL of the page to navigate to',
      title: 'Text shown when hovering over link',
      thumbnail: 'Image preview for the link',
      peekTime: 'Time to hover before preview (ms)',
      on: 'Event to trigger navigation',
      target: 'Where to open link (_self = same tab, _blank = new tab)'
    }
  },

  // Light
  light: {
    beginner: ['type', 'color', 'intensity'],
    descriptions: {
      type: 'Type of light (ambient, directional, point, spot, hemisphere)',
      color: 'Color of the light',
      intensity: 'Brightness of the light (0 = off, 1 = full)',
      angle: 'Spotlight angle (width of light cone)',
      penumbra: 'Spotlight edge softness (0 = hard edge)',
      decay: 'How light fades over distance',
      distance: 'Maximum distance of light effect',
      castShadow: 'Light casts shadows',
      shadowBias: 'Shadow quality adjustment',
      shadowCameraFar: 'Shadow render distance',
      shadowCameraSize: 'Shadow map size',
      target: 'Object the light points at',
      groundColor: 'Hemisphere light ground color',
      skyColor: 'Hemisphere light sky color'
    }
  },

  // Model (gltf-model)
  'gltf-model': {
    beginner: ['src'],
    descriptions: {
      src: 'URL to the 3D model file (.glb or .gltf)',
      loader: 'Which model loader to use',
      nanInstantiator: 'Handle invalid geometry',
      format: 'Model format version (auto-detected)'
    }
  },

  // Particle System
  'particle-system': {
    beginner: ['preset', 'color', 'particleCount', 'size'],
    descriptions: {
      preset: 'Quick preset (dust, snow, rain, etc.)',
      color: 'Color of particles',
      particleCount: 'Number of particles to display',
      size: 'Size of each particle',
      sizeSpread: 'Random variation in particle size',
      velocityValue: 'Base speed and direction',
      velocitySpread: 'Random variation in speed',
      accelerationValue: 'How particles accelerate',
      maxAge: 'How long particles live (seconds)',
      opacity: 'Transparency of particles',
      blending: 'How particles blend together',
      texture: 'Image to use for particles',
      duration: 'How long the system runs (0 = forever)',
      enabled: 'Enable or disable particles'
    }
  },

  // Physics
  'static-body': {
    beginner: [],
    descriptions: {
      shape: 'Collision shape (box, sphere, hull, mesh)',
      mass: 'Mass for dynamic physics (0 = immovable)',
      linearDamping: 'How quickly velocity slows down',
      angularDamping: 'How quickly rotation slows down',
      friction: 'Surface friction',
      restitution: 'Bounciness (0 = no bounce)',
      shape: 'Collision geometry type'
    }
  },

  'dynamic-body': {
    beginner: ['mass'],
    descriptions: {
      mass: 'Weight of the object (affected by gravity)',
      linearDamping: 'Air resistance for movement',
      angularDamping: 'Air resistance for rotation',
      friction: 'Surface friction',
      restitution: 'Bounciness (0 = no bounce)',
      shape: 'Collision shape (box, sphere, hull, mesh)',
      velocity: 'Initial velocity',
      angularVelocity: 'Initial rotation speed'
    }
  },

  // Sound
  sound: {
    beginner: ['src', 'autoplay', 'loop'],
    descriptions: {
      src: 'URL to audio file',
      autoplay: 'Play automatically when visible',
      loop: 'Repeat audio when finished',
      volume: 'Loudness (0 = silent, 1 = max)',
      poolSize: 'Number of simultaneous sounds',
      positional: 'Sound gets quieter with distance',
      refDistance: 'Distance where sound is full volume',
      rolloffFactor: 'How fast sound fades',
      distanceModel: 'How distance affects volume',
      loop: 'Repeat when finished',
      on: 'Event that triggers sound'
    }
  },

  // Text
  text: {
    beginner: ['value', 'color', 'align'],
    descriptions: {
      value: 'The text content to display',
      color: 'Color of the text',
      align: 'Text alignment (left, center, right)',
      width: 'Maximum width before wrapping',
      wrapCount: 'Characters per line',
      lineHeight: 'Space between lines',
      font: 'Font family (roboto, aileronsemibold, etc.)',
      fontImage: 'Bitmap font texture',
      shader: 'Text rendering style',
      side: 'Which side to render on (double = both sides)',
      anchor: 'Alignment point (center, left, right, align)',
      baseline: 'Vertical alignment (center, top, bottom)',
      transparent: 'Allow transparency in text',
      opacity: 'Text transparency'
    }
  },

  // Video
  video: {
    beginner: ['src', 'autoplay', 'loop'],
    descriptions: {
      src: 'URL to video file',
      autoplay: 'Play automatically',
      loop: 'Repeat when finished',
      volume: 'Audio volume (0-1)',
      controls: 'Show video playback controls',
      muted: 'Start muted',
      playsinline: 'Play inline on mobile (not fullscreen)',
      crossorigin: 'CORS settings for video source'
    }
  },

  // Animation
  animation: {
    beginner: ['property', 'to', 'dur', 'easing'],
    descriptions: {
      property: 'What to animate (position, rotation, scale, color, etc.)',
      to: 'Target value to animate to',
      from: 'Starting value (optional, uses current if omitted)',
      dur: 'Duration in milliseconds',
      easing: 'Speed curve (linear, easeInQuad, easeOutQuad, etc.)',
      loop: 'Repeat animation (true or number of times)',
      dir: 'Direction for loop (normal, reverse, alternate)',
      delay: 'Wait before starting (ms)',
      elasticity: 'Bounciness for elastic easing',
      round: 'Round values to integers',
      enabled: 'Enable/disable animation',
      startEvents: 'Event to trigger animation',
      pauseEvents: 'Event to pause animation',
      resumeEvents: 'Event to resume animation'
    }
  },

  // Script
  script: {
    beginner: [],
    descriptions: {
      // Dynamic scripts depend on the script component registered
    }
  },

  // Hand Controls
  'hand-controls': {
    beginner: ['hand', 'handModelStyle'],
    descriptions: {
      hand: 'Which hand (left, right, or both)',
      handModelStyle: 'Visual style (lowPoly, highPoly, etc.)',
      color: 'Hand color override',
      visible: 'Show or hide hand model'
    }
  },

  // Touch Controls
  'touch-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show touch controller model',
      visible: 'Show or hide controller'
    }
  },

  // Oculus Touch Controls
  'oculus-touch-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller'
    }
  },

  // Vive Controls
  'vive-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      buttonColor: 'Button color',
      buttonHighlightColor: 'Button color when pressed'
    }
  },

  // WebVR Controller
  'webvr-controller': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller'
    }
  },

  // Orbit Controls (for camera movement)
  'orbit-controls': {
    beginner: ['target', 'minDistance', 'maxDistance'],
    descriptions: {
      target: 'Position to orbit around',
      minDistance: 'Closest zoom distance',
      maxDistance: 'Furthest zoom distance',
      minPolarAngle: 'Lowest vertical angle',
      maxPolarAngle: 'Highest vertical angle',
      enableDamping: 'Smooth camera movement',
      dampingFactor: 'Smoothing amount',
      rotateSpeed: 'Rotation speed',
      zoomSpeed: 'Zoom speed',
      enabled: 'Enable or disable controls'
    }
  },

  // Collider
  collider: {
    beginner: ['objects'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      radius: 'Collision radius',
      shape: 'Collision shape (box, sphere)',
      debug: 'Show collision wireframes'
    }
  },

  // AABB Collider
  'aabb-collider': {
    beginner: ['objects'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      interval: 'Collision check interval',
      debug: 'Show collision boxes'
    }
  },

  // Sphere Collider
  'sphere-collider': {
    beginner: ['objects'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      radius: 'Collision sphere radius',
      center: 'Center offset of sphere',
      debug: 'Show collision spheres'
    }
  },

  // ORB Collider
  'orb-collider': {
    beginner: ['objects'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      radius: 'Collision radius',
      debug: 'Show collision visualization'
    }
  },

  // kinematic-body
  'kinematic-body': {
    beginner: [],
    descriptions: {
      mass: 'Body mass',
      radius: 'Body radius for collisions',
      linearDamping: 'Movement damping',
      angularDamping: 'Rotation damping'
    }
  },

  // Text geometry
  'text-geometry': {
    beginner: ['text', 'font'],
    descriptions: {
      text: 'Text content to display',
      font: 'Font to use (URL to typeface.json)',
      size: 'Text size',
      height: 'Text depth/thickness',
      curveSegments: 'Smoothness of curves',
      bevelEnabled: 'Add bevel/edging to text',
      bevelThickness: 'Bevel depth',
      bevelSize: 'Bevel width',
      bevelOffset: 'Bevel offset',
      bevelSegments: 'Bevel smoothness'
    }
  },

  // Background
  background: {
    beginner: ['color'],
    descriptions: {
      color: 'Background color',
      src: 'Background image URL',
      transparent: 'Transparent background'
    }
  },

  // Shadow
  shadow: {
    beginner: ['cast', 'receive'],
    descriptions: {
      cast: 'Object casts shadows',
      receive: 'Object receives shadows'
    }
  },

  // Sky
  sky: {
    beginner: ['color', 'src'],
    descriptions: {
      color: 'Sky color',
      src: 'Skybox image URL (equirectangular)',
      radius: 'Sky sphere radius',
      phiStart: 'Horizontal rotation start',
      phiLength: 'Horizontal rotation length',
      thetaStart: 'Vertical rotation start',
      thetaLength: 'Vertical rotation length'
    }
  },

  // Stars
  stars: {
    beginner: ['count', 'color'],
    descriptions: {
      count: 'Number of stars',
      color: 'Star color',
      radius: 'Distance of stars from center'
    }
  },

  // Ocean
  ocean: {
    beginner: ['color', 'width', 'depth'],
    descriptions: {
      color: 'Water color',
      width: 'Ocean width',
      depth: 'Ocean depth',
      opacity: 'Water transparency',
      speed: 'Wave animation speed',
      distortionScale: 'Wave distortion amount'
    }
  },

  // Environment
  environment: {
    beginner: ['preset', 'skyType'],
    descriptions: {
      preset: 'Quick environment preset (forest, city, studio, etc.)',
      skyType: 'Type of sky (atmosphere, gradient, cubemap)',
      skyColor: 'Sky color',
      horizonColor: 'Color at horizon',
      ground: 'Ground type (none, canyon, hills, etc.)',
      groundColor: 'Ground color',
      fog: 'Enable fog',
      fogDensity: 'Fog thickness',
      lighting: 'Lighting type',
      shadow: 'Enable shadows'
    }
  },

  // Voice
  voice: {
    beginner: [],
    descriptions: {}
  }
};

/**
 * Check if a component should show beginner mode
 */
export function isBeginnerComponent(componentName) {
  const baseName = componentName.split('__')[0];
  const component = componentHelp[baseName];
  // Show beginner mode only if component has descriptions
  return component && component.descriptions && Object.keys(component.descriptions).length > 0;
}

/**
 * Check if a property is a beginner property
 */
export function isBeginnerProperty(componentName, propertyName) {
  const baseName = componentName.split('__')[0];
  const component = componentHelp[baseName];
  if (!component || !component.beginner) return true; // Show all if not configured
  if (component.beginner.length === 0) return true; // Show all if no beginner properties defined
  return component.beginner.includes(propertyName);
}

/**
 * Get tooltip description for a property
 */
export function getPropertyDescription(componentName, propertyName) {
  const baseName = componentName.split('__')[0];
  return componentHelp[baseName]?.descriptions?.[propertyName];
}
