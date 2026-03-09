import React from 'react';
import { 
  faPlus, 
  faTrashAlt, 
  faPencilAlt,
  faTimes,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Events from '../../lib/Events';

/**
 * MixinsManager - Panel for managing A-Frame mixins
 * 
 * Allows users to list, add, edit, and delete mixins in the scene
 */
export default class MixinsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      mixins: [],
      showAddModal: false,
      showEditModal: false,
      editingMixin: null,
      newMixinId: '',
      newMixinComponents: {}
    };
  }

  componentDidMount() {
    this.loadMixins();
    // Close panel on Escape
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    // Escape: close mixins panel
    if (e.keyCode === 27) {
      if (this.state.isOpen) {
        this.setState({ isOpen: false });
      }
    }
  };

  loadMixins = () => {
    const mixins = Array.prototype.slice
      .call(document.querySelectorAll('a-mixin'))
      .map(mixin => ({
        id: mixin.id,
        element: mixin,
        components: this.getMixinComponents(mixin)
      }));
    this.setState({ mixins });
  };

  getMixinComponents = (mixin) => {
    const components = {};
    // Get all attributes from the mixin element
    if (mixin.attributes) {
      Array.from(mixin.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          components[attr.name] = attr.value;
        }
      });
    }
    return components;
  };

  getEntityCount = (mixinId) => {
    if (!AFRAME.scenes[0]) return 0;
    let count = 0;
    AFRAME.scenes[0].querySelectorAll('[mixin]').forEach(el => {
      const mixins = (el.getAttribute('mixin') || '').split(/\s+/);
      if (mixins.includes(mixinId)) {
        count++;
      }
    });
    return count;
  };

  togglePanel = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    if (!this.state.isOpen) {
      this.loadMixins();
    }
  };

  openAddModal = () => {
    this.setState({ 
      showAddModal: true, 
      newMixinId: '',
      newMixinComponents: {}
    });
  };

  closeAddModal = () => {
    this.setState({ showAddModal: false });
  };

  openEditModal = (mixin) => {
    // Get fresh component data
    const components = {};
    if (mixin.element.attributes) {
      Array.from(mixin.element.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          components[attr.name] = attr.value;
        }
      });
    }
    
    this.setState({ 
      showEditModal: true, 
      editingMixin: mixin,
      newMixinComponents: components
    });
  };

  closeEditModal = () => {
    this.setState({ showEditModal: false, editingMixin: null });
  };

  handleMixinIdChange = (e) => {
    this.setState({ newMixinId: e.target.value });
  };

  handleComponentChange = (componentName, value) => {
    this.setState(prevState => ({
      newMixinComponents: {
        ...prevState.newMixinComponents,
        [componentName]: value
      }
    }));
  };

  addMixin = () => {
    const { newMixinId, newMixinComponents } = this.state;
    if (!newMixinId.trim()) {
      alert('Please enter a mixin ID');
      return;
    }

    // Check if mixin already exists
    if (document.getElementById(newMixinId)) {
      alert('A mixin with this ID already exists');
      return;
    }

    // Create the mixin element
    const scene = AFRAME.scenes[0];
    const mixinEl = document.createElement('a-mixin');
    mixinEl.id = newMixinId;
    
    // Add components to mixin
    Object.entries(newMixinComponents).forEach(([compName, compValue]) => {
      if (compName && compValue) {
        mixinEl.setAttribute(compName, compValue);
      }
    });

    // Add to scene's asset manager
    let assetManager = scene.querySelector('a-assets');
    if (!assetManager) {
      assetManager = document.createElement('a-assets');
      scene.insertBefore(assetManager, scene.firstChild);
    }
    assetManager.appendChild(mixinEl);

    this.closeAddModal();
    this.loadMixins();
    Events.emit('mixinadd', { mixinId: newMixinId });
  };

  updateMixin = () => {
    const { editingMixin, newMixinComponents } = this.state;
    if (!editingMixin) return;

    const mixinEl = editingMixin.element;

    // Clear all existing attributes except id
    Array.from(mixinEl.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        mixinEl.removeAttribute(attr.name);
      }
    });

    // Add new components
    Object.entries(newMixinComponents).forEach(([compName, compValue]) => {
      if (compName && compValue !== undefined && compValue !== '') {
        mixinEl.setAttribute(compName, compValue);
      }
    });

    this.closeEditModal();
    this.loadMixins();
    Events.emit('mixinupdate', { mixinId: editingMixin.id });
  };

  deleteMixin = (mixin) => {
    const { id, element } = mixin;
    const entityCount = this.getEntityCount(id);
    
    let confirmMessage = `Are you sure you want to delete the mixin "${id}"?`;
    if (entityCount > 0) {
      confirmMessage += `\n\nThis mixin is used by ${entityCount} entity/entities. All references will be removed.`;
    }

    if (!confirm(confirmMessage)) return;

    // Remove mixin reference from all entities
    if (AFRAME.scenes[0]) {
      AFRAME.scenes[0].querySelectorAll('[mixin]').forEach(el => {
        const mixins = (el.getAttribute('mixin') || '').split(/\s+/).filter(m => m !== id);
        el.setAttribute('mixin', mixins.join(' '));
        Events.emit('entityupdate', {
          component: 'mixin',
          entity: el,
          property: '',
          value: mixins.join(' ')
        });
      });
    }

    // Remove the mixin element
    element.remove();

    this.loadMixins();
    Events.emit('mixinremove', { mixinId: id });
  };

  renderMixinList() {
    const { mixins, isOpen } = this.state;

    if (!isOpen) return null;

    return (
      <div className="mixins-panel">
        <div className="mixins-header">
          <span>Mixins ({mixins.length})</span>
          <button className="btn icon-only" onClick={this.openAddModal} title="Add Mixin">
            <AwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="mixins-list">
          {mixins.length === 0 ? (
            <div className="no-mixins">No mixins in scene</div>
          ) : (
            mixins.map(mixin => (
              <div key={mixin.id} className="mixin-item">
                <div className="mixin-info">
                  <span className="mixin-id">{mixin.id}</span>
                  <span className="mixin-usage">
                    {this.getEntityCount(mixin.id)} entity(s)
                  </span>
                  {Object.keys(mixin.components).length > 0 && (
                    <span className="mixin-components">
                      {Object.entries(mixin.components).map(([k, v]) => `${k}: ${v}`).join(', ')}
                    </span>
                  )}
                </div>
                <div className="mixin-actions">
                  <button 
                    className="mixin-edit" 
                    onClick={() => this.openEditModal(mixin)}
                    title="Edit mixin"
                  >
                    <AwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button 
                    className="mixin-delete" 
                    onClick={() => this.deleteMixin(mixin)}
                    title="Delete mixin"
                  >
                    <AwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  renderAddModal() {
    const { showAddModal, newMixinId } = this.state;

    if (!showAddModal) return null;

    // Common A-Frame components with help text
    const componentHelp = {
      position: 'Position: x y z (e.g., 0 1.5 -3)',
      rotation: 'Rotation: x y z in degrees (e.g., 0 45 0)',
      scale: 'Scale: x y z (e.g., 1 1 1)',
      visible: 'Visible: true or false',
      material: 'Material properties (e.g., color: #FF0000; opacity: 0.5)',
      geometry: 'Geometry type (e.g., primitive: box; width: 1; height: 1)',
      color: 'Color: hex value (e.g., #FF0000 or red)',
      opacity: 'Opacity: 0 to 1 (e.g., 0.5)',
      src: 'Source: image URL or asset id (#my-image)',
      animation: 'Animation: property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 1000',
      sound: 'Sound: src: url(audio.mp3); autoplay: true; loop: false',
      light: 'Light: type: ambient; color: #FFF; intensity: 0.5'
    };

    const commonComponents = [
      'position', 'rotation', 'scale', 'visible', 'material', 'geometry',
      'color', 'opacity', 'src', 'animation', 'sound', 'light'
    ];

    return (
      <div className="mixin-modal-overlay" onClick={this.closeAddModal}>
        <div className="mixin-modal" onClick={e => e.stopPropagation()}>
          <div className="mixin-modal-header">
            <h3>Add New Mixin</h3>
            <button className="modal-close" onClick={this.closeAddModal}>&times;</button>
          </div>
          <div className="mixin-modal-content">
            <div className="mixin-help-text">
              <p>Mixins are reusable component sets that can be applied to multiple entities.</p>
              <p>Enter a unique ID and optionally add component values below.</p>
            </div>
            <div className="form-group">
              <label>Mixin ID *</label>
              <input
                type="text"
                value={newMixinId}
                onChange={this.handleMixinIdChange}
                placeholder="e.g., my-mixin"
              />
            </div>
            <div className="form-group">
              <label>Components (optional)</label>
              <div className="component-inputs">
                {commonComponents.map(compName => (
                  <div key={compName} className="component-input">
                    <span className="component-name">{compName}</span>
                    <input
                      type="text"
                      placeholder={componentHelp[compName]}
                      onChange={(e) => this.handleComponentChange(compName, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mixin-modal-footer">
            <button className="btn" onClick={this.closeAddModal}>Cancel</button>
            <button className="btn primary" onClick={this.addMixin}>Add Mixin</button>
          </div>
        </div>
      </div>
    );
  }

  renderEditModal() {
    const { showEditModal, editingMixin, newMixinComponents } = this.state;

    if (!showEditModal || !editingMixin) return null;

    // Common A-Frame components with help text
    const componentHelp = {
      position: 'Position: x y z (e.g., 0 1.5 -3)',
      rotation: 'Rotation: x y z in degrees (e.g., 0 45 0)',
      scale: 'Scale: x y z (e.g., 1 1 1)',
      visible: 'Visible: true or false',
      material: 'Material properties (e.g., color: #FF0000; opacity: 0.5)',
      geometry: 'Geometry type (e.g., primitive: box; width: 1; height: 1)',
      color: 'Color: hex value (e.g., #FF0000 or red)',
      opacity: 'Opacity: 0 to 1 (e.g., 0.5)',
      src: 'Source: image URL or asset id (#my-image)',
      animation: 'Animation: property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 1000',
      sound: 'Sound: src: url(audio.mp3); autoplay: true; loop: false',
      light: 'Light: type: ambient; color: #FFF; intensity: 0.5'
    };

    const commonComponents = [
      'position', 'rotation', 'scale', 'visible', 'material', 'geometry',
      'color', 'opacity', 'src', 'animation', 'sound', 'light'
    ];

    return (
      <div className="mixin-modal-overlay" onClick={this.closeEditModal}>
        <div className="mixin-modal" onClick={e => e.stopPropagation()}>
          <div className="mixin-modal-header">
            <h3>Edit Mixin: {editingMixin.id}</h3>
            <button className="modal-close" onClick={this.closeEditModal}>&times;</button>
          </div>
          <div className="mixin-modal-content">
            <div className="mixin-help-text">
              <p>Update the components for this mixin. Changes will apply to all entities using this mixin.</p>
            </div>
            <div className="form-group">
              <label>Components</label>
              <div className="component-inputs">
                {commonComponents.map(compName => (
                  <div key={compName} className="component-input">
                    <span className="component-name">{compName}</span>
                    <input
                      type="text"
                      placeholder={componentHelp[compName]}
                      value={newMixinComponents[compName] || ''}
                      onChange={(e) => this.handleComponentChange(compName, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mixin-modal-footer">
            <button className="btn" onClick={this.closeEditModal}>Cancel</button>
            <button className="btn primary" onClick={this.updateMixin}>Save Changes</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="mixins-manager">
        <button 
          className="mixins-toggle" 
          onClick={this.togglePanel}
          title="Manage Mixins"
        >
          <AwesomeIcon icon={faLayerGroup} />
          <span>Mixins</span>
        </button>
        
        {this.renderMixinList()}
        {this.renderAddModal()}
        {this.renderEditModal()}
      </div>
    );
  }
}
