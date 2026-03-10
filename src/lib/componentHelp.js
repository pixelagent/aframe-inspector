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
      envMap: 'Reflection from environment texture'
    },
    overview: 'The material component defines how an object looks - its color, texture, transparency, and how it responds to light. Use shaders like "flat" for simple colors or "standard" for realistic lighting with metalness and roughness.'
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
    },
    overview: 'The geometry component defines the shape of an object. Common primitives include box, sphere, cylinder, plane, and torus. Use the "primitive" property to quickly switch between basic shapes.'
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
    },
    overview: 'The camera component defines the viewpoint for the scene. Use multiple cameras to create different views or cut scenes. The active property determines which camera is currently displayed. Field of view (fov) controls how wide or zoomed in the view appears.'
  },

  // Cursor
  cursor: {
    beginner: ['raycaster', 'fuse', 'timeout'],
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
    },
    overview: 'The cursor component enables interaction with objects in the scene. It casts a ray from the camera to detect objects. Use fuse for gaze-based interaction (hover to click) or set rayOrigin to mouse for click-based interaction. The cursor visual can be customized with geometry and material properties.'
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
    },
    overview: 'The link component creates clickable links to other VR experiences. When clicked, it navigates to the href URL. The thumbnail property shows a preview image, and peekTime controls how long to hover before showing the preview. Links are essential for creating connected VR experiences.'
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
    },
    overview: 'The light component illuminates objects in the scene. Choose from ambient (overall fill), directional (sun-like parallel rays), point (omnidirectional from a point), spot (cone-shaped), or hemisphere (sky-ground gradient). Adjust intensity, color, and shadow settings for different lighting effects.'
  },

  // Model (gltf-model)
  'gltf-model': {
    beginner: ['src'],
    descriptions: {
      src: 'URL to the 3D model file (.glb or .gltf)',
      loader: 'Which model loader to use',
      nanInstantiator: 'Handle invalid geometry',
      format: 'Model format version (auto-detected)'
    },
    overview: 'The gltf-model component loads and displays 3D models in GLTF/GLB format. GLB is the binary version which includes textures. Use this for complex 3D objects like characters, buildings, or detailed meshes.'
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
      restitution: 'Bounciness (0 = no bounce)'
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
      on: 'Event that triggers sound'
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
    },
    overview: 'The animation component adds movement and transitions to entities. Animate properties like position (movement), rotation (spinning), scale (growing/shrinking), or material properties (color changes). Use easing functions to create natural-looking motion with acceleration and deceleration.'
  },

  // Draw (drawing component)
  draw: {
    beginner: ['color', 'size'],
    descriptions: {
      color: 'Color of the drawing stroke',
      size: 'Size/thickness of the stroke',
      enabled: 'Enable or disable drawing',
      on: 'Event to trigger drawing',
      points: 'Array of points for the drawing path'
    },
    overview: 'The draw component allows users to create freehand drawings in VR. Users can draw lines and shapes in 3D space by pointing and clicking. Customize the stroke color and size for different drawing effects.'
  },

  // Smiley (emoji/face component)
  smiley: {
    beginner: ['type', 'color'],
    descriptions: {
      type: 'Type of face (happy, sad, angry, etc.)',
      color: 'Color of the face',
      size: 'Size of the smiley face',
      expression: 'Expression to display'
    },
    overview: 'The smiley component displays emoji faces in the scene. Use it to add emotional feedback, decorations, or interactive elements. Choose from various expressions to convey different emotions.'
  },

  // Draw Smiley
  'draw-smiley': {
    beginner: ['color', 'size'],
    descriptions: {
      color: 'Color of the smiley face',
      size: 'Size of the smiley face',
      type: 'Type of face (happy, sad, angry, neutral)',
      expression: 'Expression to display',
      position: 'Position offset from draw point',
      visible: 'Show or hide the smiley'
    },
    overview: 'The draw-smiley component adds emoji faces at draw points in VR. When users draw with the draw component, smiley faces can appear at the end of strokes or at specific points. Use it to add fun visual feedback to drawing interactions.'
  },

  // Script
  script: {
    beginner: [],
    descriptions: {
      // Dynamic scripts depend on the script component registered
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

  // Fog
  fog: {
    beginner: ['type', 'color', 'density', 'near', 'far'],
    descriptions: {
      type: 'Fog type: linear or exponential',
      color: 'Fog color',
      density: 'Fog density (for exponential fog)',
      near: 'Start distance (for linear fog)',
      far: 'End distance (for linear fog)'
    },
    overview: 'The fog component creates distance fog that fades objects into the distance. Use linear fog for a specific range or exponential fog for smooth, density-based fog. Great for creating atmosphere and depth in your scenes.'
  },

  // info-message
  'info-message': {
    beginner: ['htmlSrc', 'startOpened', 'width', 'height'],
    descriptions: {
      htmlSrc: 'HTML content to display in the info panel',
      startOpened: 'Whether the info panel starts open',
      width: 'Width of the info panel in pixels',
      height: 'Height of the info panel in pixels'
    },
    overview: 'The info-message component displays an informational overlay in the scene. Users can click an info button to toggle the message panel. Great for tutorials, instructions, or contextual information in your experience.'
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
    },
    overview: 'The environment component quickly creates immersive 3D environments with sky, ground, fog, and lighting. Choose from presets like forest, city, studio, or sunset for instant atmosphere. Customize individual elements like sky color, ground type, and fog density for unique environments.'
  },

  // Shadow
  shadow: {
    beginner: ['cast', 'receive'],
    descriptions: {
      cast: 'Object casts shadows onto other objects',
      receive: 'Object can have shadows cast onto it',
      autoUpdate: 'Automatically update shadow properties',
      bias: 'Shadow bias for quality adjustment',
      mapHeight: 'Shadow map height resolution',
      mapWidth: 'Shadow map width resolution',
      near: 'Near shadow camera distance',
      far: 'Far shadow camera distance'
    },
    overview: 'The shadow component controls shadow rendering for an entity. Enable cast to make the object block light and create shadows on other objects. Enable receive to allow shadows from other objects to appear on this object. Shadows require a light source with castShadow enabled.'
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
      adEnabled: 'Enable A/D keys',
      wsEnabled: 'Enable W/S keys',
      ease: 'Easing function for movement',
      drag: 'Drag/settling time'
    },
    overview: 'The wasd-controls component enables keyboard navigation in 3D space. Use W/A/S/D keys to move forward, left, backward, and right. Set fly to true to enable vertical movement. This is the standard way to navigate desktop VR experiences.'
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
      hmdEnabled: 'Enable head-mounted display tracking',
      sensitivity: 'Mouse/touch sensitivity',
      decay: 'Rotation decay rate',
      epsilon: 'Minimum angle threshold'
    },
    overview: 'The look-controls component enables camera rotation through mouse drag, touch swipe, or device orientation. On desktop, click and drag to look around. On mobile, swipe or tilt device. Enable pointerLock for immersive mouse-based looking.'
  },

  // Voice
  voice: {
    beginner: [],
    descriptions: {}
  },

  // models (for model-loader or multiple models)
  models: {
    beginner: ['src'],
    descriptions: {
      src: 'Array of URLs to 3D model files (.glb, .gltf, .obj)',
      loaded: 'Shows which models have finished loading',
      progress: 'Loading progress (0-1) for each model',
      enableCache: 'Cache loaded models in memory',
      skipCache: 'Ignore cached models and reload'
    },
    overview: 'The models component loads multiple 3D models at once. Useful for loading scenes or collections of objects. Each model can be a GLB, GLTF, or OBJ file. The src property accepts an array of URLs.'
  },

  // Debug
  debug: {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Enable or disable debug mode',
      showBoundingBoxes: 'Show bounding boxes around objects',
      showWireframes: 'Show wireframes on meshes',
      showNormals: 'Show surface normals',
      logging: 'Enable console logging'
    },
    overview: 'The debug component helps diagnose issues by showing visual helpers like bounding boxes, wireframes, and surface normals. Use it when something is not rendering correctly or to understand object positions.'
  },

  // Device Orientation Permission
  'device-orientation-permission': {
    beginner: [],
    descriptions: {
      enabled: 'Enable device orientation tracking',
      onPermission: 'Event when permission is granted'
    },
    overview: 'The device-orientation component enables tracking of mobile device orientation for VR experiences. It requires user permission on iOS devices. Use for magic window style experiences on mobile.'
  },

  // Device Orientation Permission UI
  'device-orientation-permission-ui': {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Show device orientation permission button',
      onPermission: 'Event when permission is granted',
      onDeny: 'Event when permission is denied'
    },
    overview: 'The device-orientation-permission-ui component displays a button that requests permission to use device orientation sensors. Required on iOS devices before using device orientation for VR experiences.'
  },

  // Keyboard Shortcuts
  'keyboard-shortcuts': {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Enable keyboard shortcuts',
      preset: 'Keyboard layout preset',
      customShortcuts: 'Custom key bindings'
    },
    overview: 'The keyboard-shortcuts component defines keyboard controls for the inspector and scene navigation. It provides quick access to common actions through key combinations.'
  },

  // Screenshot
  screenshot: {
    beginner: ['format'],
    descriptions: {
      format: 'Image format (png, jpeg)',
      quality: 'Image quality (0-1)',
      width: 'Screenshot width',
      height: 'Screenshot height'
    },
    overview: 'The screenshot component captures images of the current scene view. Use it to take snapshots for documentation, sharing, or debugging visual issues.'
  },

  // XR Mode UI
  'xr-mode-ui': {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Show VR/AR enter button',
      referenceSpaceType: 'VR reference space (local, viewer, floor)'
    },
    overview: 'The xr-mode-ui component controls the VR/AR enter button displayed in the bottom right. It allows users to enter immersive VR or AR experiences from the browser.'
  },

  // Grabbable
  grabbable: {
    beginner: ['grabbable'],
    descriptions: {
      grabbable: 'Enable grabbing of this object',
      hoverable: 'Enable hover highlighting',
      draggable: 'Enable dragging',
      droppable: 'Enable dropping onto other objects'
    },
    overview: 'The grabbable component makes objects interactive with VR controllers. Users can pick up, move, and release objects. Combine with other components for physics-based grabbing.'
  },

  // Hand Controls
  'hand-controls': {
    beginner: ['hand', 'handModelStyle'],
    descriptions: {
      hand: 'Which hand (left, right, or both)',
      handModelStyle: 'Visual style (lowPoly, highPoly, etc.)',
      color: 'Hand color override',
      visible: 'Show or hide hand model',
      hideOnEnterVR: 'Hide controller when entering VR'
    },
    overview: 'The hand-controls component displays virtual hands in VR. It supports hand tracking on compatible devices and controller-based hand visualization. Use for grabbable interactions and hand tracking experiences.'
  },

  // Raycaster
  raycaster: {
    beginner: ['objects', 'far'],
    descriptions: {
      objects: 'Selector for objects to detect',
      far: 'Maximum detection distance',
      near: 'Minimum detection distance',
      interval: 'Time between raycast updates (ms)',
      showLine: 'Show raycaster line',
      lineColor: 'Color of raycaster line',
      lineOpacity: 'Opacity of raycaster line',
      direction: 'Direction of the ray',
      origin: 'Starting point of the ray'
    },
    overview: 'The raycaster component casts rays from entities to detect intersections with other objects. Essential for interaction systems, it detects what objects are in front of controllers, cameras, or cursors.'
  },

  // Teleport Controls
  'teleport-controls': {
    beginner: ['cameraRig', 'teleportOrigin'],
    descriptions: {
      cameraRig: 'ID of the camera rig to move',
      teleportOrigin: 'Where to teleport from (head, hands)',
      button: 'Controller button to trigger teleport',
      curveShooting: 'Use parabolic curve for targeting',
      curveTarget: 'Length of teleport arc',
      collisionEntities: 'Objects that can be teleported onto',
      landingNormal: 'Normal for valid landing surfaces',
      landingMaxAngle: 'Maximum angle for landing surface'
    },
    overview: 'The teleport-controls component enables VR locomotion through teleportation. Point at a surface and release to instantly move there. The most comfortable way to navigate large VR environments.'
  },

  // UI
  ui: {
    beginner: ['visible'],
    descriptions: {
      visible: 'Show or hide UI elements',
      position: 'UI panel position',
      scale: 'UI panel scale',
      background: 'UI background color'
    },
    overview: 'The ui component controls user interface elements in VR. Use it to create interactive menus, buttons, and information panels within the 3D scene.'
  },

  // Video Controls
  'video-controls': {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Enable video playback controls',
      playPause: 'Show play/pause button',
      seekBar: 'Show seek bar',
      volume: 'Show volume control',
      fullscreen: 'Show fullscreen button'
    },
    overview: 'The video-controls component adds standard video playback controls to video elements. Users can play, pause, seek, and adjust volume without writing custom interaction code.'
  },

  // OCLUS Touch Controls
  'oculus-touch-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      armModel: 'Enable arm model for position',
      controllerModel: 'Custom controller model'
    },
    overview: 'The oculus-touch-controls component provides support for Oculus Touch controllers. It enables hand presence and button/trigger tracking for VR interactions on Oculus devices.'
  },

  // Vive Controls
  'vive-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      buttonColor: 'Button color',
      buttonHighlightColor: 'Button color when pressed',
      trigger: 'Enable trigger button',
      grip: 'Enable grip button',
      pad: 'Enable trackpad'
    },
    overview: 'The vive-controls component provides support for HTC Vive controllers. It tracks controller position, rotation, and button inputs for VR interactions.'
  },

  // Windows Motion Controls
  'windows-motion-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      hideOnEnterVR: 'Hide when entering immersive VR',
      scene: 'Reference to scene for controller'
    },
    overview: 'The windows-motion-controls component provides support for Windows Mixed Reality controllers. It tracks position, rotation, and various button inputs for VR interactions on Windows MR headsets.'
  },

  // Gear VR Controls
  'gearvr-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad'
    },
    overview: 'The gearvr-controls component provides support for Samsung Gear VR controllers. It enables touchpad interaction and controller tracking for Gear VR experiences.'
  },

  // Daydream Controls
  'daydream-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad'
    },
    overview: 'The daydream-controls component provides support for Google Daydream controllers. It enables touchpad interaction and controller tracking for Daydream VR experiences.'
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
      lineOpacity: 'Transparency of laser beam',
      line: 'Enable laser line'
    },
    overview: 'The laser-controls component provides a long-range ray for pointing and interacting with distant objects. Works across all controller types and is the recommended way to build VR interaction systems.'
  },

  // Super Hands
  'super-hands': {
    beginner: ['colliderEvent'],
    descriptions: {
      colliderEvent: 'Event that triggers collision detection',
      colliderEventProperty: 'Property to check for collisions',
      colliderEndEvent: 'Event when collision ends',
      hand: 'Hand entity to attach',
      grabStartButtons: 'Buttons to initiate grab',
      grabEndButtons: 'Buttons to release grab',
      stretchStartButtons: 'Buttons to start stretching',
      stretchEndButtons: 'Buttons to end stretching',
      rotateStartButtons: 'Buttons to start rotating',
      rotateEndButtons: 'Buttons to end rotating'
    },
    overview: 'The super-hands component provides advanced hand interactions including grabbing, stretching, and rotating objects. It extends basic grabbable with more complex interaction patterns.'
  },

  // Box Collider
  'box-collider': {
    beginner: ['objects'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      size: 'Size of collision box',
      debug: 'Show collision boxes',
      interval: 'Collision check interval'
    },
    overview: 'The box-collider component detects collisions using rectangular box boundaries. Use when you need precise rectangular collision detection.'
  },

  // Tracked Controls
  'tracked-controls': {
    beginner: ['id', 'controller'],
    descriptions: {
      id: 'Controller ID to track',
      controller: 'Controller type (vive, oculus, windowsMR)',
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller'
    },
    overview: 'The tracked-controls component provides generic VR controller tracking. It works with any WebXR-compatible controller and is the base for other controller-specific components.'
  },

  // Valve Index Controller
  'valve-index-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      handLevel: 'Hand height offset',
      elbow: 'Elbow model position',
      predictVelocity: 'Predict controller velocity',
      predictPosition: 'Predict controller position'
    },
    overview: 'The valve-index-controls component provides support for Valve Index controllers. It includes advanced features like elbow simulation and controller velocity prediction for more natural interactions.'
  },

  // Vive Wand
  'vive-wand-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      buttonColor: 'Button color',
      buttonHighlightColor: 'Button color when pressed',
      showMenuButton: 'Show menu button',
      haptic: 'Enable haptic feedback'
    },
    overview: 'The vive-wand-controls component provides support for HTC Vive wand controllers. It includes tracking for trackpad, trigger, grip buttons, and menu button inputs.'
  },

  // Scene
  scene: {
    beginner: ['background', 'fog'],
    descriptions: {
      background: 'Scene background color or sky',
      fog: 'Fog type and density',
      lighting: 'Default lighting setup',
      vrModeUI: 'Show VR enter button',
      enterVRButton: 'Custom VR button element',
      ref: 'Scene reference for other components',
      renderer: 'WebGL renderer settings',
      stats: 'Show performance stats',
      deviceOrientationPermissionUI: 'Show device orientation permission'
    },
    overview: 'The scene component is the root container for all A-Frame content. It sets up the rendering context, physics world, and manages all entities within the scene.'
  },

  // Pivot
  pivot: {
    beginner: ['enabled', 'pivot'],
    descriptions: {
      enabled: 'Enable pivot rotation',
      pivot: 'Pivot point position (x, y, z)',
      rotationAxis: 'Axis to rotate around (x, y, or z)',
      rotationSpeed: 'Speed of automatic rotation'
    },
    overview: 'The pivot component rotates an entity around a specified pivot point rather than its center. Useful for creating orbiting animations or adjusting object rotation origins.'
  },

  // Line
  line: {
    beginner: ['start', 'end', 'color'],
    descriptions: {
      start: 'Starting position (x, y, z)',
      end: 'Ending position (x, y, z)',
      color: 'Line color',
      opacity: 'Line transparency (0-1)',
      visible: 'Show or hide line'
    },
    overview: 'The line component draws a simple line between two 3D points. Useful for debugging, guides, or simple visual connections between objects.'
  },

  // Layer
  layer: {
    beginner: ['id', 'order'],
    descriptions: {
      id: 'Unique layer identifier',
      order: 'Render order (lower renders first)',
      objects: 'Objects assigned to this layer',
      enabled: 'Enable or disable layer'
    },
    overview: 'The layer component controls render layers for objects. Useful for managing draw order, creating masked effects, or separating objects into different render passes.'
  },

  // Text
  text: {
    beginner: ['value', 'color', 'align'],
    descriptions: {
      value: 'Text string to display',
      color: 'Text color',
      align: 'Text alignment (left, center, right)',
      width: 'Maximum text width',
      wrapCount: 'Characters per line',
      font: 'Font family to use',
      fontSize: 'Text size',
      lineHeight: 'Line spacing',
      anchor: 'Text anchor point',
      baseline: 'Vertical baseline',
      outlineWidth: 'Outline thickness',
      outlineColor: 'Outline color',
      opacity: 'Text transparency'
    },
    overview: 'The text component renders 3D text in the scene. Supports various fonts, alignment options, outlines, and word wrapping for creating labels, UI elements, and in-scene text.'
  },

  // Magic Leap Controls
  'magicleap-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad',
      gesture: 'Enable hand gestures',
      controler: 'Enable controller tracking'
    },
    overview: 'The magicleap-controls component provides support for Magic Leap controller. It enables touchpad interaction, gesture recognition, and controller tracking for Magic Leap AR experiences.'
  },

  // HP Mixed Reality Controls
  'hp-mixed-reality-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      buttonColor: 'Button color',
      buttonHighlightColor: 'Button color when pressed'
    },
    overview: 'The hp-mixed-reality-controls component provides support for HP Reverb G2 controllers. It tracks position, rotation, and button inputs for VR interactions on HP Mixed Reality headsets.'
  },

  // Pico Controls
  'pico-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad',
      battery: 'Battery level indicator',
      handTracking: 'Enable hand tracking'
    },
    overview: 'The pico-controls component provides support for Pico VR controllers. It enables touchpad interaction, controller tracking, and optional hand tracking for Pico VR headsets.'
  },

  // Meta Touch Controls
  'meta-touch-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      handTracking: 'Enable hand tracking',
      pose: 'Controller pose type',
      haptic: 'Enable haptic feedback'
    },
    overview: 'The meta-touch-controls component provides support for Meta Touch controllers (Quest 2/Pro). It includes hand tracking, controller tracking, and haptic feedback for immersive VR experiences.'
  },



  // Vive Focus Controls
  'vive-focus-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad',
      gesture: 'Enable gesture detection'
    },
    overview: 'The vive-focus-controls component provides support for HTC Vive Focus controllers. It enables touchpad interaction and controller tracking for Vive Focus VR experiences.'
  },

  // Models Array
  'models-array': {
    beginner: ['src'],
    descriptions: {
      src: 'Array of URLs to 3D model files (.glb, .gltf, .obj)',
      loaded: 'Shows which models have finished loading',
      progress: 'Loading progress (0-1) for each model',
      enableCache: 'Cache loaded models in memory',
      skipCache: 'Ignore cached models and reload',
      crossOrigin: 'CORS settings for loading models'
    },
    overview: 'The models-array component loads multiple 3D models at once. Useful for loading scenes or collections of objects. Each model can be a GLB, GLTF, or OBJ file. The src property accepts an array of URLs.'
  },

  // Hand Tracking Controls
  'hand-tracking-controls': {
    beginner: ['hand', 'handTrackingEnabled'],
    descriptions: {
      hand: 'Which hand (left, right, or both)',
      handTrackingEnabled: 'Enable hand tracking',
      modelStyle: 'Visual style of hand model',
      color: 'Hand color',
      visible: 'Show or hide hand',
      defaultPlane: 'Default interaction plane',
      emitTarget: 'Target for emitting events',
      fetchPolicy: 'How to fetch hand tracking data'
    },
    overview: 'The hand-tracking-controls component provides hand tracking using WebXR Hand Input. It displays virtual hands that can track finger movements without controllers. Use for natural hand interactions in VR.'
  },

  // Generic Tracked Controls
  'generic-tracked-controls': {
    beginner: ['controller', 'id'],
    descriptions: {
      controller: 'Controller type to track',
      id: 'Unique controller identifier',
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      armModel: 'Enable arm model for position',
      buttonMapping: 'Custom button mapping'
    },
    overview: 'The generic-tracked-controls component provides a base for tracking any WebXR-compatible controller. It handles controller connection/disconnection and provides position/rotation tracking.'
  },

  // Generic Tracked Controller Controls
  'generic-tracked-controller-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      controller: 'Controller type to track',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      id: 'Controller ID',
      armModel: 'Enable arm model for position',
      buttonMapping: 'Custom button mapping',
      haptic: 'Enable haptic feedback'
    },
    overview: 'The generic-tracked-controller-controls component provides generic controller tracking with support for various input sources. It handles controller connection/disconnection, position/rotation tracking, and button inputs for VR interactions.'
  },

  // Hide on Enter AR
  'hide-on-enter-ar': {
    beginner: ['hideOnEnterAR'],
    descriptions: {
      hideOnEnterAR: 'Hide entity when entering AR mode'
    },
    overview: 'The hide-on-enter-ar component automatically hides the entity when the user enters AR (Augmented Reality) mode. Useful for elements that should only appear in VR or on desktop.'
  },

  // Anchored
  anchored: {
    beginner: ['anchored'],
    descriptions: {
      anchored: 'Anchor position to world or screen'
    },
    overview: 'The anchored component determines how an object is positioned in AR. When anchored to world, the object stays in place in the real world. When anchored to screen, it moves with the device.'
  },

  // AR Mode UI
  'ar-mode-ui': {
    beginner: ['enabled'],
    descriptions: {
      enabled: 'Show AR enter button',
      referenceSpaceType: 'AR reference space type'
    },
    overview: 'The ar-mode-ui component controls the AR mode button displayed in the interface. It allows users to enter AR experiences from the browser on compatible devices.'
  },

  // Stats
  stats: {
    beginner: [],
    descriptions: {
      cluster: 'Show cluster statistics',
      memory: 'Show memory usage',
      render: 'Show render statistics',
      scenes: 'Show scene statistics',
      system: 'Show system information'
    },
    overview: 'The stats component displays performance statistics in the corner of the screen. Use it to monitor FPS, memory usage, and other performance metrics while developing.'
  },

  // Position
  position: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Horizontal position (left/right)',
      y: 'Vertical position (up/down)',
      z: 'Depth position (forward/backward)'
    },
    overview: 'The position component sets the location of an entity in 3D space using X (horizontal), Y (vertical), and Z (depth) coordinates.'
  },

  // Rotation
  rotation: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Rotation around horizontal axis (pitch)',
      y: 'Rotation around vertical axis (yaw)',
      z: 'Rotation around depth axis (roll)'
    },
    overview: 'The rotation component sets the orientation of an entity using Euler angles in degrees. X is pitch (up/down), Y is yaw (left/right), Z is roll (tilt).'
  },

  // Scale
  scale: {
    beginner: ['x', 'y', 'z'],
    descriptions: {
      x: 'Horizontal scale (1 = normal)',
      y: 'Vertical scale (1 = normal)',
      z: 'Depth scale (1 = normal)'
    },
    overview: 'The scale component sets the size of an entity. Values greater than 1 enlarge the object, values between 0 and 1 shrink it. Use uniform scaling (same X, Y, Z) to preserve proportions.'
  },

  // Visible
  visible: {
    beginner: ['visible'],
    descriptions: {
      visible: 'Show or hide the entity'
    },
    overview: 'The visible component controls whether an entity and its children are rendered. When set to false, the entity is hidden but still exists in the scene.'
  },

  // Logitech MX Ink Controls
  'logitechmx-ink-controls': {
    beginner: ['hand', 'ink'],
    descriptions: {
      hand: 'Which hand (left or right)',
      ink: 'Enable ink/drawing functionality',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      strokeWidth: 'Width of ink strokes',
      strokeColor: 'Color of ink strokes',
      haptic: 'Enable haptic feedback'
    },
    overview: 'The logitechmx-ink-controls component provides support for Logitech MX Ink 3D stylus controllers. It enables precise drawing and writing in VR with pressure sensitivity support.'
  },

  // ORB Collider (Object-Ray-Box Collider)
  'orb-collider': {
    beginner: ['objects', 'radius'],
    descriptions: {
      objects: 'Selector for objects to collide with',
      radius: 'Collision sphere radius',
      debug: 'Show collision visualization',
      interval: 'Collision check interval',
      collideOnce: 'Only trigger collision once'
    },
    overview: 'The orb-collider component detects collisions using spherical boundaries. Use when you need simple spherical collision detection for objects like spheres or balls.'
  },

  // OBJ Model
  'obj-model': {
    beginner: ['src'],
    descriptions: {
      src: 'URL to the OBJ model file',
      mtl: 'URL to the Material file (MTL)',
      color: 'Model color override',
      material: 'Material properties'
    },
    overview: 'The obj-model component loads and displays 3D models in OBJ format. OBJ is a legacy 3D format that pairs with MTL material files for textures. Use for loading models from older 3D software.'
  },

  // Oculus Go Controls
  'oculus-go-controls': {
    beginner: ['hand'],
    descriptions: {
      hand: 'Which hand (left or right)',
      model: 'Show controller model',
      visible: 'Show or hide controller',
      touchpad: 'Enable touchpad',
      haptic: 'Enable haptic feedback',
      buttonColor: 'Button color',
      buttonHighlightColor: 'Button color when pressed'
    },
    overview: 'The oculus-go-controls component provides support for Oculus Go controllers. It enables touchpad interaction and button tracking for Oculus Go VR experiences.'
  },



  // Mixin
  mixin: {
    beginner: [],
    descriptions: {
      // Mixins are composite configurations
    },
    overview: 'The mixin component allows you to define reusable sets of component properties. Instead of adding the same components and values to multiple entities, create a mixin once and reference it by name. Mixins are defined in the scene and applied using the mixin property.'
  },

  // Class
  class: {
    beginner: ['name'],
    descriptions: {
      name: 'CSS class name(s) for styling and querying',
      components: 'Components attached to entities with this class'
    },
    overview: 'The class component assigns CSS-like classes to entities for styling and querying. Use classes to group entities together and apply behaviors or styles to all entities in that class.'
  },

  // Required
  required: {
    beginner: [],
    descriptions: {
      components: 'List of required components'
    },
    overview: 'The required component specifies which components are required for an entity. It is used by component authors to declare dependencies and ensure entities have the necessary components to function correctly.'
  },

  // Parent
  parent: {
    beginner: [],
    descriptions: {
      // Parent is used for nesting entities
    },
    overview: 'The parent component establishes parent-child relationships between entities. Child entities inherit transformations from their parent and are positioned relative to it.'
  },

  // Event Set
  'event-set': {
    beginner: ['_event', '_set'],
    descriptions: {
      _event: 'Event to listen for',
      _set: 'Property to set when event fires',
      _target: 'Target element to modify',
      _delay: 'Delay before setting property (ms)'
    },
    overview: 'The event-set component allows you to set property values in response to events without writing JavaScript. When the specified event fires, it sets the defined properties on the entity.'
  },

  // State
  state: {
    beginner: ['state'],
    descriptions: {
      state: 'State name to set',
      on: 'Event to trigger state change',
      off: 'Event to remove state',
      target: 'Target entity for state'
    },
    overview: 'The state component manages entity state for use with event-set or other state-based systems. States can be triggered by events and used to conditionally show/hide or modify entities.'
  },

  // Kinematic Body (aframe-extras)
  'kinematic-body': {
    beginner: [],
    descriptions: {
      mass: 'Body mass',
      radius: 'Body radius for collisions',
      linearDamping: 'Movement damping',
      angularDamping: 'Rotation damping',
      height: 'Body height',
      width: 'Body width',
      depth: 'Body depth',
      shape: 'Collision shape (box, sphere)'
    },
    overview: 'The kinematic-body component provides a physics body that can be moved by user input but is not affected by other physics objects. Used for player controllers in aframe-extras.'
  },

  // Vehicle (aframe-extras)
  vehicle: {
    beginner: [],
    descriptions: {
      autoWheel: 'Auto-create wheel entities',
      chassis: 'Chassis entity selector',
      wheels: 'Wheel entity selectors',
      radius: 'Wheel radius',
      suspensionStiffness: 'Suspension stiffness',
      suspensionDamping: 'Suspension damping',
      maxSuspensionTravel: 'Max suspension travel',
      frictionSlip: 'Wheel friction',
      rollInfluence: 'Roll influence on corners'
    },
    overview: 'The vehicle component provides vehicle physics with wheels and suspension. Use with aframe-extras for realistic car simulation with proper wheel physics and handling.'
  }
};

/**
 * Get an overview/help text for a component
 */
export function getComponentOverview(componentName) {
  const baseName = componentName.split('__')[0];
  return componentHelp[baseName]?.overview;
}

/**
 * Get full help content for a component (for the help modal)
 */
export function getComponentFullHelp(componentName) {
  const baseName = componentName.split('__')[0];
  const help = componentHelp[baseName];
  if (!help) return null;

  return {
    title: baseName,
    overview: help.overview || `The ${baseName} component adds functionality to entities in your scene.`,
    beginnerProperties: help.beginner || [],
    descriptions: help.descriptions || {}
  };
}

/**
 * Check if a component should show beginner mode
 */

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
