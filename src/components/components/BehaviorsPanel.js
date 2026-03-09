import React from 'react';
import PropTypes from 'prop-types';
import {
  faMagic,
  faPlus,
  faTrashAlt,
  faPencilAlt,
  faExternalLinkAlt,
  faArrowLeft,
  faArrowRight,
  faWindowRestore,
  faPlay,
  faStop,
  faVolumeUp,
  faEye,
  faEyeSlash,
  faCog,
  faImages,
  faComment,
  faInfoCircle,
  faFont,
  faPlayCircle,
  faStopCircle,
  faPauseCircle,
  faVrCardboard,
  faMobileAlt,
  faTimesCircle,
  faMapMarkerAlt,
  faHeart,
  faSync,
  faExpand,
  faPalette,
  faArrowsAlt,
  faRandom,
  faRedo,
  faAdjust,
  faExclamationTriangle,
  faBolt,
  faCode,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Collapsible from '../Collapsible';
import behaviorsManager, { BehaviorsManager } from '../../lib/BehaviorsManager';
import Events from '../../lib/Events';

// Icon mapping for behaviors
const iconMap = {
  'fa-external-link-alt': faExternalLinkAlt,
  'fa-arrow-left': faArrowLeft,
  'fa-arrow-right': faArrowRight,
  'fa-window-restore': faWindowRestore,
  'fa-play': faPlay,
  'fa-stop': faStop,
  'fa-play-circle': faPlayCircle,
  'fa-eye': faEye,
  'fa-eye-slash': faEyeSlash,
  'fa-cog': faCog,
  'fa-images': faImages,
  'fa-comment': faComment,
  'fa-info-circle': faInfoCircle,
  'fa-font': faFont,
  'fa-play-circle': faPlayCircle,
  'fa-stop-circle': faStopCircle,
  'fa-pause-circle': faPauseCircle,
  'fa-vr-cardboard': faVrCardboard,
  'fa-mobile-alt': faMobileAlt,
  'fa-times-circle': faTimesCircle,
  'fa-map-marker-alt': faMapMarkerAlt,
  // Anime.js icons
  'fa-heart': faHeart,
  'fa-sync': faSync,
  'fa-expand': faExpand,
  'fa-palette': faPalette,
  'fa-arrows-alt': faArrowsAlt,
  'fa-random': faRandom,
  'fa-redo': faRedo,
  'fa-adjust': faAdjust,
  'fa-exclamation-triangle': faExclamationTriangle,
  'fa-bolt': faBolt,
  'fa-code': faCode,
  'fa-question-circle': faQuestionCircle
};

/**
 * BehaviorsPanel - Dreamweaver-style Behaviors UI
 * 
 * Allows users to add/remove interactive behaviors to selected entities
 */
export default class BehaviorsPanel extends React.Component {
  static propTypes = {
    entity: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedBehavior: null,
      behaviorParams: {},
      entityBehaviors: [],
      editingBehavior: null,
      sceneEntities: [],
      availableAssets: [],
      availableTextures: [],
      showHelp: false
    };
  }

  componentDidMount() {
    Events.on('behavioradd', this.onBehaviorChange);
    Events.on('behaviorremove', this.onBehaviorChange);
    Events.on('behaviorupdate', this.onBehaviorChange);
    Events.on('entityselect', this.onEntityChange);
    this.updateEntityBehaviors();
    this.updateSceneData();
  }

  componentWillUnmount() {
    Events.off('behavioradd', this.onBehaviorChange);
    Events.off('behaviorremove', this.onBehaviorChange);
    Events.off('behaviorupdate', this.onBehaviorChange);
    Events.off('entityselect', this.onEntityChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.entity !== this.props.entity) {
      this.updateEntityBehaviors();
      this.updateSceneData();
    }
  }

  onBehaviorChange = () => {
    this.updateEntityBehaviors();
  };

  onEntityChange = () => {
    this.setState({
      isModalOpen: false,
      selectedBehavior: null,
      behaviorParams: {},
      editingBehavior: null
    });
    this.updateEntityBehaviors();
    this.updateSceneData();
  };

  updateSceneData = () => {
    const entities = BehaviorsManager.getSceneEntities();
    const assets = BehaviorsManager.getAvailableAssets();
    const textures = BehaviorsManager.getAllTextures();
    this.setState({
      sceneEntities: entities,
      availableAssets: assets,
      availableTextures: textures
    });
  };

  updateEntityBehaviors = () => {
    if (this.props.entity) {
      const behaviors = behaviorsManager.getBehaviorsForEntity(this.props.entity);
      this.setState({ entityBehaviors: behaviors });
    } else {
      this.setState({ entityBehaviors: [] });
    }
  };

  openModal = (editingBehavior = null) => {
    this.setState({
      isModalOpen: true,
      selectedBehavior: editingBehavior ? editingBehavior.name : null,
      behaviorParams: editingBehavior ? { ...editingBehavior.params } : {},
      editingBehavior: editingBehavior
    });
    this.updateSceneData();
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedBehavior: null,
      behaviorParams: {},
      editingBehavior: null,
      showHelp: false
    });
  };

  selectBehavior = (behaviorKey) => {
    const behavior = BehaviorsManager.BEHAVIORS[behaviorKey];
    const defaultParams = {};

    if (behavior && behavior.params) {
      behavior.params.forEach(param => {
        defaultParams[param.name] = param.default;
      });
    }

    this.setState({
      selectedBehavior: behaviorKey,
      behaviorParams: defaultParams,
      showHelp: false
    });
  };

  updateParam = (paramName, value) => {
    this.setState(prevState => ({
      behaviorParams: {
        ...prevState.behaviorParams,
        [paramName]: value
      }
    }));
  };

  toggleHelp = () => {
    this.setState(prevState => ({
      showHelp: !prevState.showHelp
    }));
  };

  applyBehavior = () => {
    if (!this.props.entity || !this.state.selectedBehavior) return;

    const { editingBehavior, selectedBehavior, behaviorParams } = this.state;

    if (editingBehavior) {
      // Update existing behavior
      behaviorsManager.updateBehavior(
        this.props.entity,
        editingBehavior.id,
        behaviorParams
      );
    } else {
      // Add new behavior
      behaviorsManager.applyBehavior(
        this.props.entity,
        selectedBehavior,
        behaviorParams
      );
    }

    this.closeModal();
  };

  removeBehavior = (behavior) => {
    if (!this.props.entity) return;

    if (confirm(`Do you really want to remove the "${behavior.behavior.name}" behavior?`)) {
      behaviorsManager.removeBehavior(this.props.entity, behavior.componentName);
    }
  };

  editBehavior = (behavior) => {
    this.openModal({
      id: behavior.id,
      name: behavior.name,
      params: { ...behavior.params }
    });
  };

  renderBehaviorButton(behaviorKey, behavior) {
    const icon = iconMap[behavior.icon] || faMagic;
    return (
      <button
        key={behaviorKey}
        className="behavior-option"
        onClick={() => this.selectBehavior(behaviorKey)}
        title={behavior.description}
      >
        <AwesomeIcon icon={icon} />
        <span>{behavior.name}</span>
      </button>
    );
  }

  renderCategory(categoryName, behaviors) {
    return (
      <div key={categoryName} className="behavior-category">
        <div className="category-title">{categoryName}</div>
        <div className="category-behaviors">
          {behaviors.map(b => this.renderBehaviorButton(b.key, b))}
        </div>
      </div>
    );
  }

  renderParamInput(param) {
    const { behaviorParams, selectedBehavior, sceneEntities, availableAssets, availableTextures } = this.state;
    const value = behaviorParams[param.name] !== undefined
      ? behaviorParams[param.name]
      : param.default;

    switch (param.type) {
      case 'text':
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            />
          </div>
        );
      case 'number':
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            />
          </div>
        );
      case 'textarea':
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <textarea
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            />
          </div>
        );
      case 'select':
        const options = param.options.map(opt =>
          typeof opt === 'object' ? opt : { value: opt, label: opt }
        );
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <select
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );
      case 'checkbox':
        return (
          <div key={param.name} className="param-input checkbox">
            <label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => this.updateParam(param.name, e.target.checked)}
              />
              {param.label}
            </label>
          </div>
        );
      case 'entity':
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <select
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            >
              <option value="">-- Select Element --</option>
              <option value="this.el">This Element</option>
              {sceneEntities.map(ent => (
                <option key={ent.value} value={ent.value}>{ent.label}</option>
              ))}
            </select>
          </div>
        );
      case 'asset':
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <select
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            >
              <option value="">-- Select Asset --</option>
              {availableAssets.map(asset => (
                <option key={asset.value} value={asset.value}>{asset.label}</option>
              ))}
              <option value="">-- Or enter URL --</option>
            </select>
            {value === '' && (
              <input
                type="text"
                placeholder="Or enter image URL"
                onChange={(e) => this.updateParam(param.name, e.target.value)}
                style={{ marginTop: '5px' }}
              />
            )}
          </div>
        );
      case 'texture':
        // Use all textures from scene (including from textureModal)
        return (
          <div key={param.name} className="param-input">
            <label>{param.label}</label>
            <select
              value={value}
              onChange={(e) => this.updateParam(param.name, e.target.value)}
            >
              <option value="">-- Select Image --</option>
              {availableTextures.length > 0 ? (
                availableTextures.map(tex => (
                  <option key={tex.value} value={tex.value}>{tex.label} ({tex.type})</option>
                ))
              ) : (
                <option value="" disabled>No images found in scene</option>
              )}
              <option value="">-- Or enter URL --</option>
            </select>
            {value === '' && (
              <input
                type="text"
                placeholder="Or enter image URL"
                onChange={(e) => this.updateParam(param.name, e.target.value)}
                style={{ marginTop: '5px' }}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  }

  renderModal() {
    if (!this.state.isModalOpen) return null;

    const behaviorsByCategory = BehaviorsManager.getBehaviorsByCategory();
    const selectedBehaviorData = this.state.selectedBehavior
      ? BehaviorsManager.BEHAVIORS[this.state.selectedBehavior]
      : null;

    const isEditing = !!this.state.editingBehavior;
    const behaviorHelp = this.state.selectedBehavior
      ? BehaviorsManager.getBehaviorHelp(this.state.selectedBehavior)
      : null;

    return (
      <div className="behavior-modal-overlay" onClick={this.closeModal}>
        <div className="behavior-modal" onClick={(e) => e.stopPropagation()}>
          <div className="behavior-modal-header">
            <div className="behavior-modal-title">
              <AwesomeIcon icon={faMagic} />
              <span>{isEditing ? 'Edit Behavior' : 'Add Behavior'}</span>
            </div>
            <button className="behavior-modal-close" onClick={this.closeModal}>&times;</button>
          </div>

          {!isEditing && !this.state.selectedBehavior ? (
            <div className="behavior-modal-content">
              <div className="behavior-categories">
                {Object.entries(behaviorsByCategory).map(([category, behaviors]) =>
                  this.renderCategory(category, behaviors)
                )}
              </div>
            </div>
          ) : (
            <div className="behavior-modal-content">
              <div className="behavior-category selected">
                <div className="category-title">{selectedBehaviorData.category}</div>
                <div className="category-behaviors">
                  <button
                    className="behavior-option selected"
                    onClick={() => this.setState({ selectedBehavior: null, editingBehavior: null, showHelp: false })}
                  >
                    <AwesomeIcon icon={iconMap[selectedBehaviorData.icon] || faMagic} />
                    <span>{selectedBehaviorData.name}</span>
                  </button>
                </div>
              </div>

              {selectedBehaviorData && selectedBehaviorData.params.length > 0 && !this.state.showHelp && (
                <div className="behavior-params">
                  <div className="params-title">Parameters</div>
                  <div className="params-form">
                    {selectedBehaviorData.params.map(param => this.renderParamInput(param))}
                  </div>
                </div>
              )}

              {this.state.showHelp && behaviorHelp && (
                <div className="behavior-help">
                  <div className="help-section">
                    <h4>Description</h4>
                    <p>{behaviorHelp.description}</p>
                  </div>

                  {behaviorHelp.examples && behaviorHelp.examples.length > 0 && (
                    <div className="help-section">
                      <h4>Examples</h4>
                      <ul>
                        {behaviorHelp.examples.map((example, idx) => (
                          <li key={idx}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {behaviorHelp.generatedCode && (
                    <div className="help-section">
                      <h4>Generated Code</h4>
                      <pre>{behaviorHelp.generatedCode}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="behavior-modal-footer">
            {selectedBehaviorData && (
              <button
                className={`btn help-btn ${this.state.showHelp ? 'active' : ''}`}
                onClick={this.toggleHelp}
                title="Show help"
              >
                <AwesomeIcon icon={faQuestionCircle} />
                <span>{this.state.showHelp ? 'Hide Help' : 'Help'}</span>
              </button>
            )}
            <div className="footer-actions">
              <button className="btn" onClick={this.closeModal}>Cancel</button>
              <button
                className="btn primary"
                onClick={this.applyBehavior}
                disabled={!this.state.selectedBehavior}
              >
                {isEditing ? 'Update Behavior' : 'Apply Behavior'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderEntityBehavior(behavior) {
    const icon = iconMap[behavior.behavior.icon] || faMagic;
    const eventLabel = behavior.params.event || 'click';

    return (
      <div key={behavior.componentName} className="entity-behavior">
        <div className="behavior-info">
          <AwesomeIcon icon={icon} />
          <div className="behavior-details">
            <span className="behavior-name">{behavior.behavior.name}</span>
            <span className="behavior-event">on {eventLabel}</span>
          </div>
        </div>
        <div className="behavior-actions">
          <button
            className="behavior-edit"
            onClick={() => this.editBehavior(behavior)}
            title="Edit behavior"
          >
            <AwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            className="behavior-remove"
            onClick={() => this.removeBehavior(behavior)}
            title="Remove behavior"
          >
            <AwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { entity } = this.props;
    const { entityBehaviors } = this.state;

    if (!entity) return null;

    return (
      <div className="behaviors-panel">
        <div className="panel-header">
          <div className="panel-header-title">
            <AwesomeIcon icon={faMagic} />
            <span>Behaviors</span>
          </div>
          <button
            className="btn icon-only"
            onClick={() => this.openModal()}
            title="Add Behavior"
          >
            <AwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="behaviors-list">
          {entityBehaviors.length === 0 ? (
            <div className="no-behaviors">
              <p>No behaviors added yet.</p>
              <button className="btn" onClick={() => this.openModal()}>
                <AwesomeIcon icon={faPlus} />
                <span>Add Behavior</span>
              </button>
            </div>
          ) : (
            entityBehaviors.map(behavior => this.renderEntityBehavior(behavior))
          )}
        </div>

        {this.renderModal()}
      </div>
    );
  }
}
