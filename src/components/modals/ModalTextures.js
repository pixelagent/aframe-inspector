import React from 'react';
import PropTypes from 'prop-types';
import { faSearch, faImage, faCode, faCube, faDownload, faVideo, faMusic, faFile, faPlus, faTrash, faEdit, faCopy } from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Events from '../../lib/Events';
import Modal from './Modal';
import {
  getFilename,
  getIdFromUrl,
  insertNewAsset,
  isValidId,
  isBlobUrl,
  blobUrlToDownloadableUrl
} from '../../lib/assetsUtils';

export default class ModalTextures extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    selectedTexture: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      isOpen: this.props.isOpen,
      assetsImages: [],
      registryImages: [],
      addNewDialogOpened: false,
      newUrl: '',
      activeTab: 'textures', // 'textures', 'classes', 'models', 'assets', or 'javascript'
      preview: {
        width: 0,
        height: 0,
        src: '',
        id: '',
        name: '',
        filename: '',
        type: '',
        value: '',
        loaded: false
      }
    };
    this.imageName = React.createRef();
    this.preview = React.createRef();
    this.registryGallery = React.createRef();
  }

  onAssetsImagesLoad = (images) => {
    this.generateFromRegistry();
  };

  componentDidMount() {
    Events.on('assetsimagesload', this.onAssetsImagesLoad);
    this.generateFromAssets();
  }

  componentWillUnmount() {
    Events.off('assetsimagesload', this.onAssetsImagesLoad);
  }

  componentDidUpdate(prevProps) {
    if (this.state.isOpen && !AFRAME.INSPECTOR.assetsLoader.hasLoaded) {
      AFRAME.INSPECTOR.assetsLoader.load();
    }
    if (this.state.isOpen && this.state.isOpen !== prevProps.isOpen) {
      this.generateFromAssets();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isOpen !== props.isOpen) {
      return { isOpen: props.isOpen };
    }
    return null;
  }

  onClose = (value) => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  selectTexture = (value) => {
    if (this.props.onClose) {
      this.props.onClose(value);
    }
  };

  generateFromRegistry = () => {
    var self = this;
    AFRAME.INSPECTOR.assetsLoader.images.forEach((imageData) => {
      var image = new Image();
      image.addEventListener('load', () => {
        self.state.registryImages.push({
          id: imageData.id,
          src: imageData.fullPath,
          width: imageData.width,
          height: imageData.height,
          name: imageData.id,
          type: 'registry',
          tags: imageData.tags,
          value: 'url(' + imageData.fullPath + ')'
        });
        self.setState({ registryImages: self.state.registryImages.slice() });
      });
      image.src = imageData.fullThumbPath;
    });
  };

  generateFromAssets = () => {
    this.setState({ assetsImages: [] });

    var self = this;
    Array.prototype.slice
      .call(document.querySelectorAll('a-assets img'))
      .forEach((asset) => {
        var image = new Image();
        image.addEventListener('load', () => {
          self.state.assetsImages.push({
            id: asset.id,
            src: image.src,
            width: image.width,
            height: image.height,
            name: asset.id,
            type: 'asset',
            value: '#' + asset.id
          });
          self.setState({ assetsImages: self.state.assetsImages });
        });
        image.src = asset.src;
      });

    // Also check for blob URLs in the scene elements
    const scene = AFRAME.INSPECTOR.sceneEl;
    if (scene) {
      // Find all elements with texture/src attributes that might be blob URLs
      const elementsWithSrc = scene.querySelectorAll('[src], [material]');
      elementsWithSrc.forEach((el) => {
        const src = el.getAttribute('src');
        if (src && isBlobUrl(src)) {
          // Try to load blob URL for preview
          const img = new Image();
          img.addEventListener('load', () => {
            // Check if we already have this blob URL in the list
            const existingIndex = self.state.assetsImages.findIndex(a => a.src === src);
            if (existingIndex === -1) {
              self.state.assetsImages.push({
                id: 'blob-' + Date.now(),
                src: img.src, // This will be the blob URL
                width: img.width,
                height: img.height,
                name: 'Blob Asset',
                type: 'blob',
                value: src
              });
              self.setState({ assetsImages: self.state.assetsImages.slice() });
            }
          });
          img.src = src;
        }

        // Check material component for textures
        const material = el.getAttribute('material');
        if (material && typeof material === 'object') {
          Object.keys(material).forEach(key => {
            const value = material[key];
            if (typeof value === 'string' && isBlobUrl(value)) {
              const img = new Image();
              img.addEventListener('load', () => {
                const existingIndex = self.state.assetsImages.findIndex(a => a.src === value);
                if (existingIndex === -1) {
                  self.state.assetsImages.push({
                    id: 'blob-' + Date.now(),
                    src: img.src,
                    width: img.width,
                    height: img.height,
                    name: 'Blob Texture',
                    type: 'blob',
                    value: value
                  });
                  self.setState({ assetsImages: self.state.assetsImages.slice() });
                }
              });
              img.src = value;
            }
          });
        }
      });
    }
  };

  onNewUrl = (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    var self = this;
    var inputUrl = event.target.value;

    // Check if it's a blob URL and handle it specially
    if (isBlobUrl(inputUrl)) {
      blobUrlToDownloadableUrl(inputUrl)
        .then(({ url, filename }) => {
          // Use the converted URL
          self.preview.current.addEventListener('load', function onImageLoaded() {
            self.preview.current.removeEventListener('load', onImageLoaded);
            var src = self.preview.current.src;
            var name = getFilename(src, true);
            var existingAssetId = getIdFromUrl(src);
            if (existingAssetId) {
              name = existingAssetId;
            }
            self.setState({
              preview: {
                width: self.preview.current.naturalWidth,
                height: self.preview.current.naturalHeight,
                src: src,
                id: '',
                name: name,
                filename: filename,
                type: existingAssetId ? 'asset' : 'new',
                loaded: true,
                value: 'url(' + src + ')',
                isBlob: true,
                originalBlobUrl: inputUrl
              }
            });
            self.imageName.current.focus();
          });
          self.preview.current.src = url;
        })
        .catch(error => {
          console.error('Error converting blob URL:', error);
          alert('Could not load blob URL. The URL may be invalid or inaccessible.');
        });
      return;
    }

    function onImageLoaded(img) {
      var src = self.preview.current.src;
      var name = getFilename(src, true);
      var existingAssetId = getIdFromUrl(src);
      if (existingAssetId) {
        name = existingAssetId;
      }
      self.setState({
        preview: {
          width: self.preview.current.naturalWidth,
          height: self.preview.current.naturalHeight,
          src: src,
          id: '',
          name: name,
          filename: getFilename(src),
          type: existingAssetId ? 'asset' : 'new',
          loaded: true,
          value: 'url(' + src + ')'
        }
      });
      self.preview.current.removeEventListener('load', onImageLoaded);

      // Auto-save the texture to a-assets if it's a new URL (not from registry)
      if (!existingAssetId && name) {
        try {
          insertNewAsset('img', name, src, () => {
            // Refresh the assets list after adding
            self.generateFromAssets();
          });
          // Show success feedback
          self.setState({ addNewDialogOpened: false });
        } catch (e) {
          console.error('Error auto-saving texture:', e);
        }
      }
    }
    this.preview.current.addEventListener('load', onImageLoaded);
    this.preview.current.src = event.target.value;

    this.imageName.current.focus();
  };

  onNameChanged = (event) => {
    var state = this.state.preview;
    state.name = event.target.value;
    this.setState({ preview: state });
  };

  toggleNewDialog = () => {
    this.setState({ addNewDialogOpened: !this.state.addNewDialogOpened });
    this.clear();
  };

  clear() {
    this.setState({
      preview: {
        width: 0,
        height: 0,
        src: '',
        id: '',
        filename: '',
        name: '',
        type: '',
        loaded: false,
        value: ''
      },
      newUrl: ''
    });
  }

  onUrlChange = (e) => {
    this.setState({ newUrl: e.target.value });
  };

  // Add a new texture from the preview panel
  addNewTexture = () => {
    if (this.state.preview.type === 'asset') {
      return;
    }

    // If this is a converted blob, we need to handle it specially
    if (this.state.preview.isBlob && this.state.preview.originalBlobUrl) {
      // Convert blob to data URL and save as asset
      blobUrlToDownloadableUrl(this.state.preview.originalBlobUrl)
        .then(({ url }) => {
          // Create an image element to get the data
          const img = new Image();
          img.onload = () => {
            // Create a canvas to convert to data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/png');

            // Insert as new asset with data URL
            insertNewAsset(
              'img',
              this.state.preview.name,
              dataUrl,
              () => {
                this.generateFromAssets();
                this.setState({ addNewDialogOpened: false });
                this.clear();
                alert(`Texture "${this.state.preview.name}" has been added to the gallery!`);
              }
            );
          };
          img.src = url;
        })
        .catch(error => {
          console.error('Error saving blob texture:', error);
          alert('Could not save texture. The blob may be invalid.');
        });
      return;
    }

    insertNewAsset(
      'img',
      this.state.preview.name,
      this.state.preview.src,
      () => {
        this.generateFromAssets();
        this.setState({ addNewDialogOpened: false });
        this.clear();
        alert(`Texture "${this.state.preview.name}" has been added to the gallery!`);
      }
    );
  };

  onChangeFilter = (e) => {
    this.setState({ filterText: e.target.value });
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  renderTabs() {
    return (
      <div className="settings-tabs">
        <button
          className={`settings-tab ${this.state.activeTab === 'textures' ? 'active' : ''}`}
          onClick={() => this.setActiveTab('textures')}
        >
          <AwesomeIcon icon={faImage} />
          Textures
        </button>
        <button
          className={`settings-tab ${this.state.activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => this.setActiveTab('classes')}
        >
          <AwesomeIcon icon={faCode} />
          Classes
        </button>
        <button
          className={`settings-tab ${this.state.activeTab === 'models' ? 'active' : ''}`}
          onClick={() => this.setActiveTab('models')}
        >
          <AwesomeIcon icon={faCube} />
          Models
        </button>
        <button
          className={`settings-tab ${this.state.activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => this.setActiveTab('assets')}
        >
          <AwesomeIcon icon={faFile} />
          Assets
        </button>
        <button
          className={`settings-tab ${this.state.activeTab === 'javascript' ? 'active' : ''}`}
          onClick={() => this.setActiveTab('javascript')}
        >
          <AwesomeIcon icon={faCode} />
          JavaScript
        </button>
      </div>
    );
  }

  renderClassesTab() {
    // Get all unique classes from the scene
    const classes = new Set();
    const scene = AFRAME.INSPECTOR.sceneEl;
    if (scene) {
      scene.querySelectorAll('*').forEach((el) => {
        const classAttr = el.getAttribute('class');
        if (classAttr) {
          classAttr.split(/\s+/).forEach((c) => {
            if (c) classes.add(c);
          });
        }
      });
    }
    const classList = Array.from(classes).sort();

    // Also get custom CSS classes from the style element (may not be applied to any element yet)
    const customClasses = new Set();
    const styleEl = document.getElementById('custom-css-styles');
    if (styleEl && styleEl.textContent) {
      const matches = styleEl.textContent.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)\s*\{[^}]*\}/g);
      if (matches) {
        matches.forEach((rule) => {
          const match = rule.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/);
          if (match) {
            customClasses.add(match[1]);
          }
        });
      }
    }
    const customClassList = Array.from(customClasses).sort();

    // Combine both lists (custom classes first, then element classes)
    const allClasses = [...new Set([...customClassList, ...classList])];

    return (
      <div className="classes-tab">
        <div className="classes-header">
          <h3>CSS Classes in Scene</h3>
          <p>Add, edit, or remove CSS classes for your elements.</p>
        </div>

        <div className="classes-actions">
          <button className="add-class-btn" onClick={this.addNewClass}>
            <AwesomeIcon icon={faPlus} /> Add Class
          </button>
        </div>

        <div className="classes-list">
          {allClasses.length === 0 ? (
            <p className="no-classes">No classes found. Click "Add Class" to create one.</p>
          ) : (
            <ul>
              {allClasses.map((className) => (
                <li key={className} className="class-item">
                  <span className="class-name">.{className}</span>
                  <span className="class-count">
                    ({customClassList.includes(className) ? 'custom' : `${this.getClassUsageCount(className)} elements`})
                  </span>
                  <div className="class-item-actions">
                    <button
                      className="class-edit"
                      onClick={() => this.editClass(className)}
                      title="Edit CSS properties"
                    >
                      <AwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="class-delete"
                      onClick={() => this.deleteClass(className)}
                      title="Delete class from all elements"
                    >
                      <AwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="classes-help">
          <p>Click the pencil icon to edit CSS properties for a class. Click the trash icon to remove the class from all elements.</p>
        </div>
      </div>
    );
  }

  getClassUsageCount(className) {
    const scene = AFRAME.INSPECTOR.sceneEl;
    if (!scene) return 0;
    let count = 0;
    scene.querySelectorAll('*').forEach((el) => {
      const classAttr = el.getAttribute('class');
      if (classAttr && classAttr.split(/\s+/).includes(className)) {
        count++;
      }
    });
    return count;
  }

  // Add a new CSS class to elements in the scene
  addNewClass = () => {
    const className = prompt('Enter new CSS class name:');
    if (!className) return;

    // Validate class name
    const validClassName = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
    if (!validClassName.test(className)) {
      alert('Invalid class name. Must start with a letter and contain only letters, numbers, hyphens, and underscores.');
      return;
    }

    // Create a style element for this class if it doesn't exist
    let styleEl = document.getElementById('custom-css-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-css-styles';
      document.head.appendChild(styleEl);
    }

    // Add empty CSS rule for this class
    const currentStyles = styleEl.textContent || '';
    styleEl.textContent = currentStyles + `\n.${className} { }`;

    // Refresh the classes list
    this.setState({});
  };

  // Edit CSS properties for a class
  editClass = (className) => {
    // Get current CSS properties for this class
    let styleEl = document.getElementById('custom-css-styles');
    let currentProps = '';

    if (styleEl) {
      // Try to extract existing properties
      const match = styleEl.textContent.match(new RegExp(`\\.${className}\\s*\\{([^}]*)\\}`));
      if (match) {
        currentProps = match[1].trim();
      }
    }

    // Prompt for new CSS properties
    const newProps = prompt(`Edit CSS properties for .${className}:\n\nEnter in format: property: value;\nExample: background-color: red; color: white;`, currentProps);

    if (newProps === null) return; // Cancelled

    // Validate the CSS properties format
    if (newProps && !newProps.includes(':')) {
      alert('Invalid format. Use: property: value;');
      return;
    }

    // Update or create the style element
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-css-styles';
      document.head.appendChild(styleEl);
    }

    let currentStyles = styleEl.textContent || '';

    // Remove existing rule for this class
    currentStyles = currentStyles.replace(new RegExp(`\\.${className}\\s*\\{[^}]*\\}`, 'g'), '');

    // Add new rule
    if (newProps.trim()) {
      currentStyles = currentStyles.trim() + `\n.${className} { ${newProps} }`;
    }

    styleEl.textContent = currentStyles;
    this.setState({});
  };

  // Delete a CSS class (removes from all elements and from style element)
  deleteClass = (className) => {
    if (!confirm(`Are you sure you want to delete the class "${className}"?`)) return;

    // First, remove from all elements in the scene
    const scene = AFRAME.INSPECTOR.sceneEl;
    if (scene) {
      scene.querySelectorAll('*').forEach((el) => {
        const classAttr = el.getAttribute('class');
        if (classAttr) {
          const classes = classAttr.split(/\s+/).filter(c => c && c !== className);
          if (classes.length > 0) {
            el.setAttribute('class', classes.join(' '));
          } else {
            el.removeAttribute('class');
          }
        }
      });
    }

    // Also remove the CSS rule from the style element if it exists
    const styleEl = document.getElementById('custom-css-styles');
    if (styleEl && styleEl.textContent) {
      let currentStyles = styleEl.textContent;
      // Remove the CSS rule for this class
      currentStyles = currentStyles.replace(new RegExp(`\\.?${className}\\s*\\{[^}]*\\}`, 'g'), '');
      styleEl.textContent = currentStyles;
    }

    this.setState({});
  };

  // Helper function to show toast notification

  // Helper function to get model name from src
  getModelName(src) {
    if (!src) return 'Unknown';
    // If it's an asset reference like #one, extract the name
    if (src.startsWith('#')) {
      return src.substring(1);
    }
    // If it's a URL, extract filename without extension
    const match = src.match(/\/([^/]+)\.(glb|gltf|obj|fbx)$/i);
    if (match) {
      return match[1];
    }
    return src;
  }

  // Download a model file
  downloadModel = async (model) => {
    let url = model.src;

    // If it's an asset reference, try to get the actual URL from the asset
    if (url.startsWith('#')) {
      const assetId = url.substring(1);
      const scene = AFRAME.INSPECTOR.sceneEl;
      const asset = scene.querySelector(`a-assets > #${assetId}`);
      if (asset) {
        const srcAttr = asset.getAttribute('src');
        if (srcAttr) {
          url = srcAttr;
        }
      }
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch model');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = this.getModelName(url) + '.' + (url.split('.').pop() || 'glb');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading model:', error);
      alert('Could not download model. The URL may be invalid or cross-origin restrictions apply.');
    }
  };

  // Add a new model to the scene
  addNewModel = () => {
    const id = prompt('Enter ID for new model asset:');
    if (!id) return;

    if (!isValidId(id)) {
      alert('Invalid ID. IDs must start with a letter and contain only letters, numbers, and hyphens.');
      return;
    }

    if (document.getElementById(id)) {
      alert('An element with this ID already exists.');
      return;
    }

    const src = prompt('Enter URL for the model (.glb or .gltf):');
    if (!src) return;

    const scene = AFRAME.INSPECTOR.sceneEl;
    let assets = scene.querySelector('a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      scene.insertBefore(assets, scene.firstChild);
    }

    const newAsset = document.createElement('a-asset-item');
    newAsset.setAttribute('id', id);
    newAsset.setAttribute('src', src);
    assets.appendChild(newAsset);

    this.setState({});
  };

  // Delete a model from a-assets
  deleteModelAsset = (modelName) => {
    if (!confirm(`Are you sure you want to delete the model "${modelName}"?`)) return;

    const scene = AFRAME.INSPECTOR.sceneEl;
    const asset = scene.querySelector(`a-assets > #${modelName}`);
    if (asset) {
      asset.remove();
      this.setState({});
    }
  };

  renderModelsTab() {
    // Get all models (gltf-model, models, models-array, modal-array) from the scene
    const models = [];
    const scene = AFRAME.INSPECTOR.sceneEl;
    if (scene) {
      // Find all elements with model-related attributes
      scene.querySelectorAll('*').forEach((el) => {
        // Check for modal-array component (custom component with models named one, two, three, four)
        const modalArray = el.getAttribute('modal-array');
        if (modalArray && modalArray.models) {
          modalArray.models.forEach((modelData, idx) => {
            const name = modelData.name || modelData.src || `model-${idx + 1}`;
            const src = modelData.src || '';
            if (src && !models.find(m => m.src === src && m.name === name)) {
              models.push({
                type: 'modal-array',
                src: src,
                name: name,
                element: el.tagName
              });
            }
          });
        }

        // Check for gltf-model
        const gltfModel = el.getAttribute('gltf-model');
        if (gltfModel) {
          const modelSrc = typeof gltfModel === 'string' ? gltfModel : gltfModel.src;
          if (modelSrc && !models.find(m => m.src === modelSrc)) {
            models.push({ type: 'gltf-model', src: modelSrc, name: this.getModelName(modelSrc), element: el.tagName });
          }
        }

        // Check for model attribute (used by some components)
        const model = el.getAttribute('model');
        if (model) {
          const modelSrc = typeof model === 'string' ? model : model.src;
          if (modelSrc && !models.find(m => m.src === modelSrc)) {
            models.push({ type: 'model', src: modelSrc, name: this.getModelName(modelSrc), element: el.tagName });
          }
        }

        // Check for models (array) attribute
        const modelsAttr = el.getAttribute('models');
        if (modelsAttr && Array.isArray(modelsAttr)) {
          modelsAttr.forEach((m) => {
            const src = m.src || m;
            if (src && !models.find(m => m.src === src)) {
              models.push({ type: 'models', src: src, name: this.getModelName(src), element: el.tagName });
            }
          });
        }

        // Check for models-array attribute
        const modelsArray = el.getAttribute('models-array');
        if (modelsArray && modelsArray.src) {
          const src = modelsArray.src;
          if (Array.isArray(src)) {
            src.forEach((s) => {
              if (s && !models.find(m => m.src === s)) {
                models.push({ type: 'models-array', src: s, name: this.getModelName(s), element: el.tagName });
              }
            });
          } else if (src && !models.find(m => m.src === src)) {
            models.push({ type: 'models-array', src: src, name: this.getModelName(src), element: el.tagName });
          }
        }
      });

      // Also check a-assets for model assets
      const assets = scene.querySelectorAll('a-assets > [id]');
      assets.forEach((asset) => {
        if (asset.hasAttribute('gltf-model') || asset.getAttribute('src')?.endsWith('.glb') || asset.getAttribute('src')?.endsWith('.gltf')) {
          const src = '#' + asset.id;
          if (!models.find(m => m.src === src)) {
            models.push({ type: 'asset', src: src, name: asset.id, element: 'a-asset' });
          }
        }
      });
    }

    return (
      <div className="models-tab">
        <div className="models-header">
          <h3>3D Models in Scene</h3>
          <p>These models are used by elements in your scene.</p>
        </div>

        <div className="models-actions">
          <button className="add-model-btn" onClick={this.addNewModel}>
            <AwesomeIcon icon={faPlus} /> Add Model
          </button>
        </div>

        <div className="models-list">
          {models.length === 0 ? (
            <p className="no-models">No models found in the scene.</p>
          ) : (
            <ul>
              {models.map((model, index) => (
                <li key={index} className="model-item">
                  <div className="model-icon">
                    <AwesomeIcon icon={faCube} />
                  </div>
                  <div className="model-info">
                    <span className="model-name">{model.name}</span>
                    <span className="model-src">{model.src}</span>
                    <span className="model-type">{model.type} ({model.element})</span>
                  </div>
                  <div className="model-actions">
                    <button
                      className="model-download"
                      onClick={() => this.downloadModel(model)}
                      title="Download model"
                    >
                      <AwesomeIcon icon={faDownload} />
                    </button>
                    {model.type === 'asset' && (
                      <button
                        className="model-delete"
                        onClick={() => this.deleteModelAsset(model.name)}
                        title="Delete model asset"
                      >
                        <AwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="models-help">
          <p>To add a model, click "Add Model" above or use the gltf-model component on an entity.</p>
        </div>
      </div>
    );
  }

  // Delete an asset from a-assets
  deleteAsset = (assetId) => {
    if (confirm(`Are you sure you want to delete the asset "${assetId}"?`)) {
      const scene = AFRAME.INSPECTOR.sceneEl;
      const asset = scene.querySelector(`a-assets > #${assetId}`);
      if (asset) {
        asset.remove();
        // Force re-render
        this.setState({});
      }
    }
  };

  // Add a new asset
  addNewAsset = (assetType) => {
    const id = prompt(`Enter ID for new ${assetType} asset:`);
    if (!id) return;

    if (!isValidId(id)) {
      alert('Invalid ID. IDs must start with a letter and contain only letters, numbers, and hyphens.');
      return;
    }

    if (document.getElementById(id)) {
      alert('An element with this ID already exists.');
      return;
    }

    const scene = AFRAME.INSPECTOR.sceneEl;
    let assets = scene.querySelector('a-assets');
    if (!assets) {
      assets = document.createElement('a-assets');
      scene.insertBefore(assets, scene.firstChild);
    }

    let newAsset;
    if (assetType === 'img') {
      const src = prompt('Enter URL for the image:');
      if (!src) return;
      newAsset = document.createElement('img');
      newAsset.setAttribute('id', id);
      newAsset.setAttribute('src', src);
    } else if (assetType === 'video') {
      const src = prompt('Enter URL for the video:');
      if (!src) return;
      newAsset = document.createElement('video');
      newAsset.setAttribute('id', id);
      newAsset.setAttribute('src', src);
      newAsset.setAttribute('loop', '');
      newAsset.setAttribute('muted', '');
      newAsset.setAttribute('playsinline', '');
    } else if (assetType === 'audio') {
      const src = prompt('Enter URL for the audio:');
      if (!src) return;
      newAsset = document.createElement('audio');
      newAsset.setAttribute('id', id);
      newAsset.setAttribute('src', src);
    } else if (assetType === 'model') {
      const src = prompt('Enter URL for the model (.glb or .gltf):');
      if (!src) return;
      newAsset = document.createElement('a-asset-item');
      newAsset.setAttribute('id', id);
      newAsset.setAttribute('src', src);
    } else if (assetType === 'mixin') {
      // For mixins, ask for the mixin properties
      const mixinProps = prompt(`Enter mixin properties for "${id}":\n\nExample: material="color: red" geometry="primitive: box"`);
      if (!mixinProps) return;
      newAsset = document.createElement('a-mixin');
      newAsset.setAttribute('id', id);
      // Parse the properties and set them
      const props = mixinProps.match(/(\w+)="([^"]*)"/g);
      if (props) {
        props.forEach(prop => {
          const [key, value] = prop.split('=');
          newAsset.setAttribute(key, value.replace(/"/g, ''));
        });
      }
    }

    if (newAsset) {
      assets.appendChild(newAsset);
      this.setState({});
    }
  };

  // Edit an asset (change its src or other attributes, or enter raw HTML)
  editAsset = (assetId, assetType) => {
    const scene = AFRAME.INSPECTOR.sceneEl;
    const asset = scene.querySelector(`a-assets > #${assetId}`);
    if (!asset) return;

    // Get current outerHTML as a starting point
    const currentHtml = asset.outerHTML;

    // Show a prompt with the current HTML and allow editing
    const newHtml = prompt(
      `Edit asset "${assetId}".\n\n` +
      `Current HTML:\n${currentHtml}\n\n` +
      `Enter new HTML for this asset (or press Cancel to keep current):`,
      currentHtml
    );

    if (newHtml && newHtml !== currentHtml) {
      try {
        // Create a temporary container to parse the new HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newHtml;
        const newAsset = tempDiv.firstChild;

        if (!newAsset || newAsset.id !== assetId) {
          alert('Error: The ID in the new HTML must remain "' + assetId + '".');
          return;
        }

        // Replace the old asset with the new one
        asset.parentNode.replaceChild(newAsset, asset);
        this.setState({});
      } catch (error) {
        console.error('Error updating asset:', error);
        alert('Error updating asset. Please check your HTML syntax.');
      }
    }
  };

  renderAssetsTab() {
    // Get all assets from a-assets
    const assets = [];
    const scene = AFRAME.INSPECTOR.sceneEl;

    if (scene) {
      const assetsContainer = scene.querySelector('a-assets');
      if (assetsContainer) {
        assetsContainer.querySelectorAll('[id]').forEach((asset) => {
          const tagName = asset.tagName.toLowerCase();
          let type = 'other';
          let icon = faFile;

          if (tagName === 'img') {
            type = 'img';
            icon = faImage;
          } else if (tagName === 'video') {
            type = 'video';
            icon = faVideo;
          } else if (tagName === 'audio') {
            type = 'audio';
            icon = faMusic;
          } else if (tagName === 'a-asset-item' || asset.hasAttribute('gltf-model')) {
            type = 'model';
            icon = faCube;
          } else if (tagName === 'a-mixin') {
            type = 'mixin';
            icon = faCopy;
          }

          assets.push({
            id: asset.id,
            type: type,
            src: asset.getAttribute('src') || '',
            icon: icon
          });
        });
      }
    }

    return (
      <div className="assets-tab">
        <div className="assets-header">
          <h3>a-assets Elements</h3>
          <p>Manage assets defined in your scene's &lt;a-assets&gt; element.</p>
        </div>

        <div className="assets-actions">
          <button className="add-asset-btn" onClick={() => this.addNewAsset('img')}>
            <AwesomeIcon icon={faPlus} /> Add Image
          </button>
          <button className="add-asset-btn" onClick={() => this.addNewAsset('video')}>
            <AwesomeIcon icon={faPlus} /> Add Video
          </button>
          <button className="add-asset-btn" onClick={() => this.addNewAsset('audio')}>
            <AwesomeIcon icon={faPlus} /> Add Audio
          </button>
          <button className="add-asset-btn" onClick={() => this.addNewAsset('model')}>
            <AwesomeIcon icon={faPlus} /> Add Model
          </button>
          <button className="add-asset-btn" onClick={() => this.addNewAsset('mixin')}>
            <AwesomeIcon icon={faPlus} /> Add Mixin
          </button>
        </div>

        <div className="assets-list">
          {assets.length === 0 ? (
            <p className="no-assets">No assets found. Use the buttons above to add assets.</p>
          ) : (
            <ul>
              {assets.map((asset) => (
                <li key={asset.id} className="asset-item">
                  <div className="asset-icon">
                    <AwesomeIcon icon={asset.icon} />
                  </div>
                  <div className="asset-info">
                    <span className="asset-id">{asset.id}</span>
                    <span className="asset-type">{asset.type}</span>
                    <span className="asset-src" title={asset.src}>{asset.src}</span>
                  </div>
                  <div className="asset-actions">
                    <button
                      className="asset-edit"
                      onClick={() => this.editAsset(asset.id, asset.type)}
                      title="Edit asset"
                    >
                      <AwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="asset-delete"
                      onClick={() => this.deleteAsset(asset.id)}
                      title="Delete asset"
                    >
                      <AwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="assets-help">
          <p>Assets defined here can be referenced using the #id syntax in your scene elements.</p>
          <p>Click the edit button to modify the full HTML of an asset (src, loop, crossorigin, playsinline, etc.).</p>
        </div>
      </div>
    );
  }

  // Get all script tags from the document
  getScriptTags() {
    const scripts = [];
    document.querySelectorAll('head > script, body > script').forEach((script) => {
      scripts.push({
        id: script.id || '',
        src: script.getAttribute('src') || '',
        content: script.textContent || '',
        isInline: !script.getAttribute('src'),
        type: script.getAttribute('type') || 'text/javascript',
        element: script
      });
    });
    return scripts;
  }

  // Add a new script tag
  addNewScript = () => {
    const isInline = confirm('Click OK to add an inline script, or Cancel to add an external script.');

    if (isInline) {
      // Add inline script
      const id = prompt('Enter ID for the script (optional):');
      const content = prompt('Enter JavaScript code:');
      if (content === null) return;

      const script = document.createElement('script');
      script.id = id || '';
      script.type = 'text/javascript';
      script.textContent = content;
      document.body.appendChild(script);
    } else {
      // Add external script
      const id = prompt('Enter ID for the script (optional):');
      const src = prompt('Enter URL for the script:');
      if (!src) return;

      const script = document.createElement('script');
      script.id = id || '';
      script.type = 'text/javascript';
      script.src = src;
      document.body.appendChild(script);
    }

    this.setState({});
  };

  // Edit a script tag
  editScript = (scriptIndex) => {
    const scripts = this.getScriptTags();
    const script = scripts[scriptIndex];
    if (!script) return;

    if (script.isInline) {
      // Edit inline script content
      const newContent = prompt('Edit JavaScript code:', script.content);
      if (newContent === null) return;
      script.element.textContent = newContent;
    } else {
      // Edit external script (src only)
      const newSrc = prompt('Edit script URL:', script.src);
      if (newSrc === null) return;
      script.element.setAttribute('src', newSrc);
    }

    this.setState({});
  };

  // Delete a script tag
  deleteScript = (scriptIndex) => {
    const scripts = this.getScriptTags();
    const script = scripts[scriptIndex];
    if (!script) return;

    if (!confirm(`Are you sure you want to delete this script?`)) return;

    script.element.remove();
    this.setState({});
  };

  renderJavaScriptTab() {
    const scripts = this.getScriptTags();

    return (
      <div className="javascript-tab">
        <div className="javascript-header">
          <h3>JavaScript in Page</h3>
          <p>Manage script tags in your HTML. View inline scripts and external JS files.</p>
        </div>

        <div className="javascript-actions">
          <button className="add-script-btn" onClick={this.addNewScript}>
            <AwesomeIcon icon={faPlus} /> Add Script
          </button>
        </div>

        <div className="javascript-list">
          {scripts.length === 0 ? (
            <p className="no-scripts">No scripts found. Click "Add Script" to add one.</p>
          ) : (
            <ul>
              {scripts.map((script, index) => (
                <li key={index} className="script-item">
                  <div className="script-icon">
                    <AwesomeIcon icon={faCode} />
                  </div>
                  <div className="script-info">
                    <span className="script-name">
                      {script.id || (script.isInline ? `inline-script-${index + 1}` : `script-${index + 1}`)}
                    </span>
                    <span className="script-type">{script.isInline ? 'inline' : 'external'}</span>
                    {script.isInline ? (
                      <span className="script-preview" title={script.content}>
                        {script.content.substring(0, 50)}...
                      </span>
                    ) : (
                      <span className="script-src">{script.src}</span>
                    )}
                  </div>
                  <div className="script-actions">
                    <button
                      className="script-edit"
                      onClick={() => this.editScript(index)}
                      title="Edit script"
                    >
                      <AwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="script-delete"
                      onClick={() => this.deleteScript(index)}
                      title="Delete script"
                    >
                      <AwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="javascript-help">
          <p>Inline scripts show a preview of their content. External scripts show their URL.</p>
          <p>Note: The aframe-inspector script is not shown in this list.</p>
        </div>
      </div>
    );
  }

  renderRegistryImages() {
    var self = this;
    let selectSample = function (image) {
      let name = getFilename(image.name, true);
      const existingAssetId = getIdFromUrl(image.src);
      if (existingAssetId) {
        name = existingAssetId;
      }
      self.setState({
        preview: {
          width: image.width,
          height: image.height,
          src: image.src,
          id: '',
          name: name,
          filename: getFilename(image.src),
          type: existingAssetId ? 'asset' : 'registry',
          loaded: true,
          value: 'url(' + image.src + ')'
        }
      });
      self.imageName.current.focus();
    };

    var filterText = this.state.filterText.toUpperCase();

    return this.state.registryImages
      .filter((image) => {
        return (
          image.id.toUpperCase().indexOf(filterText) > -1 ||
          image.name.toUpperCase().indexOf(filterText) > -1 ||
          image.tags.indexOf(filterText) > -1
        );
      })
      .map(function (image) {
        let imageClick = selectSample.bind(this, image);
        return (
          <li key={image.src} onClick={imageClick}>
            <img width="155px" height="155px" src={image.src} />
            <div className="detail">
              <span className="title">{image.name}</span>
              <span>{getFilename(image.src)}</span>
              <span>
                {image.width} x {image.height}
              </span>
            </div>
          </li>
        );
      });
  }

  render() {
    let isOpen = this.state.isOpen;
    let preview = this.state.preview;

    let validId = isValidId(this.state.preview.name);
    let assetIdTaken =
      validId && !!document.getElementById(this.state.preview.name);
    let validAsset =
      this.state.preview.loaded &&
      validId &&
      !assetIdTaken &&
      this.state.preview.type !== 'asset';

    let addNewAssetButton = this.state.addNewDialogOpened
      ? 'BACK'
      : 'LOAD TEXTURE';

    return (
      <Modal
        id="textureModal"
        title="Settings"
        isOpen={isOpen}
        onClose={this.onClose}
        closeOnClickOutside={false}
      >
        {this.renderTabs()}
        <div className="settings-content">
          {this.state.activeTab === 'textures' && (
            <>
              <button onClick={this.toggleNewDialog}>{addNewAssetButton}</button>
              <div className={this.state.addNewDialogOpened ? '' : 'hide'}>
                <div className="newimage">
                  <div className="new_asset_options">
                    <span>Load a new texture from one of these sources:</span>
                    <ul>
                      <li>
                        <span>From URL (and press Enter):</span>{' '}
                        <input
                          type="text"
                          className="imageUrl"
                          value={this.state.newUrl}
                          onChange={this.onUrlChange}
                          onKeyUp={this.onNewUrl}
                          spellCheck="false"
                        />
                      </li>
                      <li>
                        <span>From assets registry: </span>
                        <div className="assets search">
                          <input
                            placeholder="Filter..."
                            value={this.state.filterText}
                            onChange={this.onChangeFilter}
                          />
                          <AwesomeIcon icon={faSearch} />
                        </div>
                        <ul ref={this.registryGallery} className="gallery">
                          {this.renderRegistryImages()}
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="preview">
                    Name:{' '}
                    <input
                      ref={this.imageName}
                      className={
                        this.state.preview.name.length > 0 &&
                          (!validId || assetIdTaken)
                          ? 'error'
                          : ''
                      }
                      readOnly={preview.type === 'asset'}
                      type="text"
                      value={this.state.preview.name}
                      onChange={this.onNameChanged}
                      onKeyUp={(event) => {
                        if (event.keyCode === 13 && validAsset) {
                          this.addNewTexture();
                        }
                      }}
                      spellCheck="false"
                    />
                    {preview.type !== 'asset' && assetIdTaken && (
                      <div className="iderror">
                        Name already taken by another asset or entity
                      </div>
                    )}
                    {this.state.preview.name.length > 0 && !validId && (
                      <div className="iderror">Name is not valid</div>
                    )}
                    {preview.type === 'asset' && (
                      <div className="iderror">Texture already loaded</div>
                    )}
                    <img
                      ref={this.preview}
                      width="155px"
                      height="155px"
                      src={preview.src}
                      style={{ visibility: preview.src ? 'visible' : 'hidden' }}
                    />
                    {this.state.preview.loaded ? (
                      <div className="detail">
                        <span className="title" title={preview.filename}>
                          {preview.filename}
                        </span>
                        <br />
                        <span>
                          {preview.width} x {preview.height}
                        </span>
                      </div>
                    ) : (
                      <span />
                    )}
                    <br />
                    <button disabled={!validAsset} onClick={this.addNewTexture}>
                      LOAD THIS TEXTURE
                    </button>
                  </div>
                </div>
              </div>
              <div className={this.state.addNewDialogOpened ? 'hide' : ''}>
                <ul className="gallery">
                  {this.state.assetsImages
                    .sort(function (a, b) {
                      return a.id > b.id;
                    })
                    .map(
                      function (image) {
                        let textureClick = this.selectTexture.bind(this, image);
                        var selectedClass =
                          this.props.selectedTexture === '#' + image.id ||
                            (image.type === 'blob' && this.props.selectedTexture === image.value)
                            ? 'selected'
                            : '';
                        return (
                          <li
                            key={image.id}
                            onClick={textureClick}
                            className={selectedClass}
                          >
                            <img width="155px" height="155px" src={image.src} />
                            <div className="detail">
                              <span className="title">{image.name}</span>
                              <span>{getFilename(image.src)}</span>
                              <span>
                                {image.width} x {image.height}
                              </span>
                            </div>
                          </li>
                        );
                      }.bind(this)
                    )}
                </ul>
              </div>
            </>
          )}
          {this.state.activeTab === 'classes' && this.renderClassesTab()}
          {this.state.activeTab === 'models' && this.renderModelsTab()}
          {this.state.activeTab === 'assets' && this.renderAssetsTab()}
          {this.state.activeTab === 'javascript' && this.renderJavaScriptTab()}
        </div>
      </Modal>
    );
  }
}

