import React from 'react';
import PropTypes from 'prop-types';
import { faSearch, faImage, faCode, faCube, faDownload } from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Events from '../../lib/Events';
import Modal from './Modal';
import {
  getFilename,
  getIdFromUrl,
  insertNewAsset,
  isValidId
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
      activeTab: 'textures', // 'textures', 'classes', or 'models'
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
  };

  onNewUrl = (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    var self = this;
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

  addNewAsset = () => {
    if (this.state.preview.type === 'asset') {
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

    return (
      <div className="classes-tab">
        <div className="classes-header">
          <h3>CSS Classes in Scene</h3>
          <p>These classes are used by elements in your scene.</p>
        </div>
        <div className="classes-list">
          {classList.length === 0 ? (
            <p className="no-classes">No classes found in the scene.</p>
          ) : (
            <ul>
              {classList.map((className) => (
                <li key={className} className="class-item">
                  <span className="class-name">{className}</span>
                  <span className="class-count">
                    ({this.getClassUsageCount(className)})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="classes-help">
          <p>To add classes to an element, select it in the scene and edit the class attribute in the sidebar.</p>
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
                  <button 
                    className="model-download" 
                    onClick={() => this.downloadModel(model)}
                    title="Download model"
                  >
                    <AwesomeIcon icon={faDownload} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="models-help">
          <p>To add a model, use the gltf-model component on an entity or add it to a-assets.</p>
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
                          this.addNewAsset();
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
                    <button disabled={!validAsset} onClick={this.addNewAsset}>
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
                          this.props.selectedTexture === '#' + image.id
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
        </div>
      </Modal>
    );
  }
}
