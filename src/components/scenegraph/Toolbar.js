import React from 'react';
import {
  faPlus,
  faPause,
  faPlay,
  faFloppyDisk,
  faQuestion,
  faCaretDown,
  faCube,
  faGlobe,
  faLightbulb,
  faCamera,
  faLayerGroup,
  faBox,
  faImage,
  faFont,
  faVideo,
  faMusic,
  faCrosshairs,
  faGamepad,
  faFlag,
  faStopwatch,
  faHeart,
  faStar,
  faTrophy,
  faCoins,
  faPlayCircle,
  faMouse,
  faRoute,
  faRedo,
  faBolt,
  faWeightHanging,
  faHandPaper,
  faEye,
  faExpandArrowsAlt,
  faGhost,
  faWalking,
  faRunning,
  faCouch,
  faUndo,
  faGear,
  faSquare,
  faCircle,
  faDatabase,
  faCaretUp,
  faGem,
  faRing,
  faLink,
  faCloud,
  faVolumeUp,
  faUser,
  faPlane,
  faVectorSquare,
  faFilm,
  faCompressArrowsAlt,
  faHandRock,
  faRandom,
  faBicycle,
  faSearchPlus,
  faSearch,
  faArrowsAlt,
  faUndoAlt,
  faPlayAlt,
  faStepForward,
  faEyeSlash,
  faTrashAlt,
  faCompress,
  faArrowsAltV,
  faBomb,
  faSync,
  faArrowUp,
  faPaperPlane,
  faMapMarkerAlt,
  faLayerBroken,
  faFileArchive,
  faFileImport,
  faFileCode,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import ThemeSelector from './ThemeSelector';
import MixinsManager from './MixinsManager';
import Events from '../../lib/Events';
import { saveBlob } from '../../lib/utils';
import { undo, redo, canUndo, canRedo, getHistoryStatus } from '../../lib/history';
import GLTFIcon from '../../../assets/gltf.svg';
import JSZip from 'jszip';

// Grouped primitive types for new entities
const PRIMITIVE_GROUPS = [
  {
    name: 'Basic Shapes',
    icon: faBox,
    items: [
      { value: 'a-box', label: 'Box', icon: faCube },
      { value: 'a-sphere', label: 'Sphere', icon: faCircle },
      { value: 'a-cylinder', label: 'Cylinder', icon: faDatabase },
      { value: 'a-plane', label: 'Plane', icon: faSquare },
      { value: 'a-circle', label: 'Circle', icon: faCircle },
      { value: 'a-cone', label: 'Cone', icon: faCaretUp },
    ]
  },
  {
    name: 'Advanced Shapes',
    icon: faCube,
    items: [
      { value: 'a-dodecahedron', label: 'Dodecahedron', icon: faGem },
      { value: 'a-tetrahedron', label: 'Tetrahedron', icon: faCaretUp },
      { value: 'a-torus', label: 'Torus', icon: faRing },
      { value: 'a-torus-knot', label: 'Torus Knot', icon: faLink },
    ]
  },
  {
    name: 'Environment',
    icon: faGlobe,
    items: [
      { value: 'a-sky', label: 'Sky', icon: faCloud },
      { value: 'a-light', label: 'Light', icon: faLightbulb },
    ]
  },
  {
    name: 'Camera & Misc',
    icon: faCamera,
    items: [
      { value: 'a-camera', label: 'Camera', icon: faCamera },
      { value: 'a-entity', label: 'Empty Entity', icon: faSquare },
      { value: 'a-scene', label: 'Scene', icon: faLayerGroup, desc: 'New scene container' },
    ]
  },
  {
    name: 'Media',
    icon: faPlayCircle,
    items: [
      { value: 'a-text', label: 'Text', icon: faFont, desc: 'Display text' },
      { value: 'a-sound', label: 'Sound', icon: faVolumeUp, desc: 'Audio playback' },
      { value: 'a-video', label: 'Video', icon: faVideo, desc: 'Video player' },
      { value: 'a-image', label: 'Image', icon: faImage, desc: '2D image' },
      { value: 'a-gltf-model', label: '3D Model', icon: faCube, desc: 'GLTF model' },
    ]
  },
  {
    name: 'Interaction',
    icon: faMouse,
    items: [
      { value: 'a-cursor', label: 'Cursor', icon: faCrosshairs, desc: 'Raycaster/cursor' },
      { value: 'a-camera', label: 'Player Camera', icon: faUser, desc: 'First-person camera' },
    ]
  },
  {
    name: 'Behaviors',
    icon: faBolt,
    description: 'Common game behaviors (adds component)',
    items: [
      { value: 'behavior-click-animation', label: 'Click to Animate', icon: faPlay, desc: 'Play animation on click' },
      { value: 'behavior-click-sound', label: 'Click to Sound', icon: faVolumeUp, desc: 'Play sound on click' },
      { value: 'behavior-click-hide', label: 'Click to Hide', icon: faEyeSlash, desc: 'Hide on click' },
      { value: 'behavior-click-destroy', label: 'Click to Destroy', icon: faTrashAlt, desc: 'Remove on click' },
      { value: 'behavior-hover-scale', label: 'Hover Scale', icon: faSearchPlus, desc: 'Scale on mouseover' },
      { value: 'behavior-look-at', label: 'Look at Camera', icon: faEye, desc: 'Always face camera' },
      { value: 'behavior-orbit', label: 'Orbit Rotate', icon: faSync, desc: 'Auto-rotate around center' },
      { value: 'behavior-bounce', label: 'Bounce', icon: faCompressArrowsAlt, desc: 'Bouncing animation' },
      { value: 'behavior-float', label: 'Float', icon: faArrowUp, desc: 'Gentle floating motion' },
      { value: 'behavior-drag-drop', label: 'Drag to Move', icon: faHandRock, desc: 'Drag and drop' },
      { value: 'behavior-spawner', label: 'Spawn on Click', icon: faPlus, desc: 'Create new entity on click' },
      { value: 'behavior-pickup', label: 'Pickup Collectible', icon: faStar, desc: 'Collect on click' },
    ]
  },
  {
    name: 'Movement',
    icon: faWalking,
    description: 'Movement controls',
    items: [
      { value: 'wasd-controls', label: 'WASD Move', icon: faWalking, desc: 'Keyboard movement' },
      { value: 'look-controls', label: 'Look Around', icon: faEye, desc: 'Mouse look' },
      { value: 'fly-controls', label: 'Fly Mode', icon: faPaperPlane, desc: 'Free-fly camera' },
      { value: 'checkpoint-controls', label: 'Checkpoints', icon: faMapMarkerAlt, desc: 'Teleport between points' },
    ]
  },
  {
    name: 'Physics',
    icon: faWeightHanging,
    description: 'Physics simulation (requires physics system)',
    items: [
      { value: 'dynamic-body', label: 'Dynamic Body', icon: faWeightHanging, desc: 'Moves with gravity' },
      { value: 'static-body', label: 'Static Body', icon: faLayerGroup, desc: 'Solid wall/floor' },
    ]
  }
];

// Flat list for backward compatibility
const PRIMITIVE_TYPES = PRIMITIVE_GROUPS.flatMap(group => group.items);

function filterHelpers(scene, visible) {
  scene.traverse((o) => {
    if (o.userData.source === 'INSPECTOR') {
      o.visible = visible;
    }
  });
}

function getSceneName(scene) {
  return scene.id || slugify(window.location.host + window.location.pathname);
}

/**
 * Slugify the string removing non-word chars and spaces
 * @param  {string} text String to slugify
 * @return {string}      Slugified string
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '-') // Replace all non-word chars with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Tools and actions.
 */
export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPlaying: false,
      showPrimitiveMenu: false,
      selectedPrimitive: 'a-box',
      canUndo: false,
      canRedo: false
    };

    // Primitive type with default components
    this.primitiveDefaults = {
      'a-entity': {},
      'a-box': { geometry: 'primitive: box' },
      'a-sphere': { geometry: 'primitive: sphere' },
      'a-cylinder': { geometry: 'primitive: cylinder' },
      'a-plane': { geometry: 'primitive: plane' },
      'a-circle': { geometry: 'primitive: circle' },
      'a-cone': { geometry: 'primitive: cone' },
      'a-dodecahedron': { geometry: 'primitive: dodecahedron' },
      'a-tetrahedron': { geometry: 'primitive: tetrahedron' },
      'a-torus': { geometry: 'primitive: torus' },
      'a-torus-knot': { geometry: 'primitive: torusKnot' },
      'a-sky': {},
      'a-light': { light: 'type: ambient' },
      'a-camera': {},
      // Standard A-Frame elements
      'a-text': { text: 'value: Hello World; color: #FFF' },
      'a-sound': { sound: 'src: url(); autoplay: false; loop: false' },
      'a-video': { video: 'src: #video-src' },
      'a-cursor': { cursor: 'rayOrigin: mouse' },
      'a-image': {},
      'a-gltf-model': {},
    };
  }

  exportSceneToGLTF() {
    const sceneName = getSceneName(AFRAME.scenes[0]);
    const scene = AFRAME.scenes[0].object3D;
    filterHelpers(scene, false);
    AFRAME.INSPECTOR.exporters.gltf.parse(
      scene,
      function (buffer) {
        filterHelpers(scene, true);
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveBlob(blob, sceneName + '.glb');
      },
      function (error) {
        console.error(error);
      },
      { binary: true }
    );
  }

  exportSceneToZip() {
    const sceneName = getSceneName(AFRAME.scenes[0]) || 'vr-project';
    const scene = AFRAME.scenes[0];

    // Get the HTML content of the current page
    let htmlContent = document.documentElement.outerHTML;

    // Remove inspector script from the exported HTML
    htmlContent = htmlContent.replace(/<script src="[^]*aframe-inspector[^]*"><\/script>/, '');
    htmlContent = htmlContent.replace(/<script src="[^]*aframe-inspector[^]*"[^]*><\/script>/, '');

    // Add PWA meta tags and manifest link if not already present
    if (!htmlContent.includes('theme-color')) {
      htmlContent = htmlContent.replace('<head>', '<head>\n  <meta name="theme-color" content="#ff6b6b">');
    }
    if (!htmlContent.includes('apple-mobile-web-app-capable')) {
      htmlContent = htmlContent.replace('<head>', '<head>\n  <meta name="apple-mobile-web-app-capable" content="yes">\n  <meta name="mobile-web-app-capable" content="yes">\n  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">');
    }
    if (!htmlContent.includes('manifest.json')) {
      htmlContent = htmlContent.replace('<head>', '<head>\n  <link rel="manifest" href="manifest.json">');
    }

    // Add service worker registration before closing body tag
    const swRegistration = `<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(registration => {
          console.log('SW registered:', registration.scope);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
</script>`;
    htmlContent = htmlContent.replace('</body>', swRegistration + '\n</body>');

    // Create zip file
    const zip = new JSZip();

    // Add the HTML file
    zip.file('index.html', htmlContent);

    // Create PWA manifest
    const manifest = {
      name: sceneName + ' - VR Experience',
      short_name: sceneName,
      description: 'A-Frame VR experience exported from Inspector',
      start_url: './index.html',
      display: 'standalone',
      background_color: '#212121',
      theme_color: '#ff6b6b',
      orientation: 'any',
      icons: [
        {
          src: 'assets/icon-192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: 'assets/icon-512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any'
        },
        {
          src: 'assets/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      categories: ['entertainment', 'games'],
      lang: 'en',
      scope: './',
      prefer_related_applications: false
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    // Add icon assets to the zip
    const icon192Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#ff6b6b" rx="24"/>
  <text x="96" y="130" font-family="Arial, sans-serif" font-size="100" text-anchor="middle" fill="white">${sceneName.charAt(0).toUpperCase()}</text>
</svg>`;
    
    const icon512Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#ff6b6b" rx="64"/>
  <text x="256" y="350" font-family="Arial, sans-serif" font-size="280" text-anchor="middle" fill="white">${sceneName.charAt(0).toUpperCase()}</text>
</svg>`;
    
    zip.file('assets/icon-192.svg', icon192Svg);
    zip.file('assets/icon-512.svg', icon512Svg);

    // Create service worker
    const serviceWorker = `// Service Worker for ${sceneName} VR Experience
const CACHE_NAME = '${sceneName.toLowerCase().replace(/\s+/g, '-')}-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // If both fail, return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      })
  );
});
`;
    zip.file('sw.js', serviceWorker);

    // Collect all assets (images, models, etc.)
    const assets = scene.querySelectorAll('[src]');
    const assetUrls = new Set();

    assets.forEach(el => {
      const src = el.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('#')) {
        assetUrls.add(src);
      }
    });

    // Also check a-assets
    const assetItems = scene.querySelectorAll('a-asset-item, img, audio, video');
    assetItems.forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('id');
      if (src && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('#')) {
        assetUrls.add(src);
      }
    });

    // If there are local assets, try to fetch them (this is a simplified version)
    // In a real implementation, you'd want to handle relative paths properly
    const assetsFolder = zip.folder('assets');

    // Generate and download the zip
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveBlob(content, sceneName + '.zip');
    });
  }

  exportSceneToHTML() {
    const sceneName = getSceneName(AFRAME.scenes[0]) || 'vr-project';

    // Get the HTML content of the current page
    let htmlContent = document.documentElement.outerHTML;

    // Remove inspector script from the exported HTML
    htmlContent = htmlContent.replace(/<script src="[^]*aframe-inspector[^]*"><\/script>/, '');
    htmlContent = htmlContent.replace(/<script src="[^]*aframe-inspector[^]*"[^]*><\/script>/, '');

    // Download as HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveBlob(blob, sceneName + '.html');
  }

  importProjectFromZip() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.zip';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const zip = await JSZip.loadAsync(file);

        // Look for HTML file
        let htmlFile = null;
        let htmlContent = null;

        for (const [filename, f] of Object.entries(zip.files)) {
          if (filename.endsWith('.html') || filename.endsWith('.htm')) {
            htmlFile = filename;
            htmlContent = await f.async('string');
            break;
          }
        }

        if (!htmlContent) {
          alert('No HTML file found in the zip');
          return;
        }

        // Open the imported project in a new window
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

      } catch (error) {
        console.error('Error importing project:', error);
        alert('Error importing project: ' + error.message);
      }
    };

    input.click();
  }

  addEntity(primitiveType = 'a-entity') {
    // Check if this is a behavior - add to selected entity instead
    if (primitiveType.startsWith('behavior-')) {
      // Emit event to add behavior to selected entity
      Events.emit('addbehavior', { behavior: primitiveType });
      this.setState({ showPrimitiveMenu: false, selectedPrimitive: 'a-entity' });
      return;
    }

    // Check if this is a camera control - add to selected entity or create new camera
    if (['wasd-controls', 'look-controls', 'fly-controls', 'checkpoint-controls'].includes(primitiveType)) {
      Events.emit('addbehavior', { behavior: primitiveType });
      this.setState({ showPrimitiveMenu: false, selectedPrimitive: 'a-entity' });
      return;
    }

    // Check if this is a physics component
    if (['dynamic-body', 'static-body'].includes(primitiveType)) {
      Events.emit('addbehavior', { behavior: primitiveType });
      this.setState({ showPrimitiveMenu: false, selectedPrimitive: 'a-entity' });
      return;
    }

    // Handle a-scene specially - it creates a new scene container
    if (primitiveType === 'a-scene') {
      Events.emit('scenecreate', { element: 'a-scene' });
      this.setState({ showPrimitiveMenu: false, selectedPrimitive: 'a-entity' });
      return;
    }

    const components = this.primitiveDefaults[primitiveType] || {};
    Events.emit('entitycreate', { element: primitiveType, components: {} });
    this.setState({ showPrimitiveMenu: false, selectedPrimitive: primitiveType });
  }

  togglePrimitiveMenu = (e) => {
    e.stopPropagation();
    this.setState({ showPrimitiveMenu: !this.state.showPrimitiveMenu });
  };

  handlePrimitiveSelect = (primitiveType) => {
    this.addEntity(primitiveType);
  };

  componentDidMount() {
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
    // Close primitive menu on Escape
    document.addEventListener('keydown', this.handleKeyDown);
    // Listen for history changes
    Events.on('historychange', this.handleHistoryChange);
    // Initialize history status
    this.setState(getHistoryStatus());
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
    Events.off('historychange', this.handleHistoryChange);
  }

  handleHistoryChange = (status) => {
    this.setState({
      canUndo: status.canUndo,
      canRedo: status.canRedo
    });
  };

  handleUndo = () => {
    undo();
  };

  handleRedo = () => {
    redo();
  };

  handleKeyDown = (e) => {
    // Escape: close primitive menu
    if (e.keyCode === 27) {
      if (this.state.showPrimitiveMenu) {
        this.setState({ showPrimitiveMenu: false });
      }
    }
  };

  handleClickOutside = () => {
    if (this.state.showPrimitiveMenu) {
      this.setState({ showPrimitiveMenu: false });
    }
  };

  /**
   * Try to write changes with aframe-inspector-watcher.
   */
  writeChanges = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:51234/save');
    xhr.onerror = () => {
      alert(
        'aframe-watcher not running. This feature requires a companion service running locally. npm install aframe-watcher to save changes back to file. Read more at https://github.com/supermedium/aframe-watcher'
      );
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(AFRAME.INSPECTOR.history.updates));
  };

  toggleScenePlaying = () => {
    if (this.state.isPlaying) {
      AFRAME.scenes[0].pause();
      this.setState({ isPlaying: false });
      AFRAME.scenes[0].isPlaying = true;
      document.getElementById('aframeInspectorMouseCursor').play();
      return;
    }
    AFRAME.scenes[0].isPlaying = false;
    AFRAME.scenes[0].play();
    this.setState({ isPlaying: true });
  };

  openHelpModal = () => {
    Events.emit('openhelpmodal');
  };

  openTexturesModal = () => {
    Events.emit('opentexturesmodal', '', null);
  };

  render() {
    const watcherTitle = 'Write changes with aframe-watcher.';

    return (
      <div id="toolbar">
        <div className="toolbarActions">
          <a
            className={`button ${!this.state.canUndo ? 'disabled' : ''}`}
            title="Undo (Ctrl+Z)"
            onClick={this.handleUndo}
          >
            <AwesomeIcon icon={faUndo} />
          </a>
          <a
            className={`button ${!this.state.canRedo ? 'disabled' : ''}`}
            title="Redo (Ctrl+Y)"
            onClick={this.handleRedo}
          >
            <AwesomeIcon icon={faRedo} />
          </a>
          <div className="addEntityContainer">
            <a
              className="button"
              title="Add a new entity"
              onClick={() => this.addEntity(this.state.selectedPrimitive)}
            >
              <AwesomeIcon icon={faPlus} />
            </a>
            <a
              className="button primitiveToggle"
              title="Choose primitive type"
              onClick={this.togglePrimitiveMenu}
            >
              <AwesomeIcon icon={faCaretDown} />
            </a>
            {this.state.showPrimitiveMenu && (
              <div className="primitiveMenu">
                <div className="primitiveMenuHeader">Add Element</div>
                {PRIMITIVE_GROUPS.map((group) => (
                  <div key={group.name} className="primitiveGroup">
                    <div className="primitiveGroupHeader">
                      <AwesomeIcon icon={group.icon} />
                      <span>{group.name}</span>
                    </div>
                    {group.items.map((type) => (
                      <a
                        key={type.value}
                        className={`primitiveMenuItem ${this.state.selectedPrimitive === type.value ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handlePrimitiveSelect(type.value);
                        }}
                      >
                        <span className="primitiveIcon"><AwesomeIcon icon={type.icon} /></span>
                        <span className="primitiveLabel">{type.label}</span>
                        <span className="primitiveTag">{type.value}</span>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a
            id="playPauseScene"
            className="button"
            title={this.state.isPlaying ? 'Pause scene' : 'Resume scene'}
            onClick={this.toggleScenePlaying}
          >
            {this.state.isPlaying ? (
              <AwesomeIcon icon={faPause} />
            ) : (
              <AwesomeIcon icon={faPlay} />
            )}
          </a>
          <a
            className="gltfIcon button"
            title="Export to GLTF"
            onClick={this.exportSceneToGLTF}
          >
            <GLTFIcon />
          </a>
          <a
            className="button"
            title="Export as HTML"
            onClick={this.exportSceneToHTML}
          >
            <AwesomeIcon icon={faFileCode} />
          </a>
          <a
            className="button"
            title="Export project as ZIP"
            onClick={this.exportSceneToZip}
          >
            <AwesomeIcon icon={faFileArchive} />
          </a>
          <a
            className="button"
            title="Import project from ZIP"
            onClick={this.importProjectFromZip}
          >
            <AwesomeIcon icon={faFolderOpen} />
          </a>
          <a
            className="button"
            title={watcherTitle}
            onClick={this.writeChanges}
          >
            <AwesomeIcon icon={faFloppyDisk} />
          </a>
          <ThemeSelector />
          <MixinsManager />
          <a className="button" title="Help" onClick={this.openHelpModal}>
            <AwesomeIcon icon={faQuestion} />
          </a>
          <a className="button" title="Settings" onClick={this.openTexturesModal}>
            <AwesomeIcon icon={faGear} />
          </a>
        </div>
      </div>
    );
  }
}
