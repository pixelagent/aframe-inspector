import React from 'react';
import PropTypes from 'prop-types';
import { faClipboard, faPlus, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import { InputWidget } from '../widgets';
import DEFAULT_COMPONENTS from './DefaultComponents';
import PropertyRow from './PropertyRow';
import Collapsible from '../Collapsible';
import Mixins from './Mixins';
import { getEntityClipboardRepresentation } from '../../lib/entity';
import EntityRepresentation from '../EntityRepresentation';
import Events from '../../lib/Events';
import copy from 'clipboard-copy';
import { saveBlob } from '../../lib/utils';
import GLTFIcon from '../../../assets/gltf.svg';

// @todo Take this out and use updateEntity?
function changeId(componentName, value) {
  var entity = AFRAME.INSPECTOR.selectedEntity;
  if (entity.id !== value) {
    entity.id = value;
    Events.emit('entityidchange', entity);
  }
}

export default class CommonComponents extends React.Component {
  static propTypes = {
    entity: PropTypes.object
  };

  onEntityUpdate = (detail) => {
    if (detail.entity !== this.props.entity) {
      return;
    }
    if (
      DEFAULT_COMPONENTS.indexOf(detail.component) !== -1 ||
      detail.component === 'mixin'
    ) {
      this.forceUpdate();
    }
  };

  componentDidMount() {
    Events.on('entityupdate', this.onEntityUpdate);
  }

  componentWillUnmount() {
    Events.off('entityupdate', this.onEntityUpdate);
  }

  renderCommonAttributes() {
    const entity = this.props.entity;
    return ['position', 'rotation', 'scale', 'visible'].map((componentName) => {
      const schema = AFRAME.components[componentName].schema;
      var data = entity.object3D[componentName];
      if (componentName === 'rotation') {
        data = {
          x: THREE.MathUtils.radToDeg(entity.object3D.rotation.x),
          y: THREE.MathUtils.radToDeg(entity.object3D.rotation.y),
          z: THREE.MathUtils.radToDeg(entity.object3D.rotation.z)
        };
      }
      return (
        <PropertyRow
          key={componentName}
          name={componentName}
          schema={schema}
          data={data}
          isSingle={true}
          componentname={componentName}
          entity={entity}
        />
      );
    });
  }

  exportToGLTF() {
    const entity = this.props.entity;
    AFRAME.INSPECTOR.exporters.gltf.parse(
      entity.object3D,
      function (buffer) {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveBlob(blob, (entity.id || 'entity') + '.glb');
      },
      function (error) {
        console.error(error);
      },
      { binary: true }
    );
  }

  render() {
    const entity = this.props.entity;
    if (!entity) {
      return <div />;
    }
    const entityButtons = (
      <div>
        <a
          title="Export entity to GLTF"
          className="gltfIcon button"
          onClick={(event) => {
            this.exportToGLTF();
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <GLTFIcon />
        </a>
        <a
          title="Copy entity HTML to clipboard"
          className="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            copy(getEntityClipboardRepresentation(this.props.entity));
          }}
        >
          <AwesomeIcon icon={faClipboard} />
        </a>
      </div>
    );

    return (
      <Collapsible id="componentEntityHeader" className="commonComponents">
        <div className="collapsible-header">
          <EntityRepresentation entity={entity} />
          {entityButtons}
        </div>
        <div className="collapsible-content">
          <div className="propertyRow">
            <label htmlFor="id" className="text">
              ID
            </label>
            <InputWidget
              onBlur={changeId}
              entity={entity}
              name="id"
              value={entity.id}
            />
          </div>
          <div className="propertyRow">
            <label className="text">class</label>
            <ClassManager entity={entity} />
          </div>
          {this.renderCommonAttributes()}
          <Mixins entity={entity} />
        </div>
      </Collapsible>
    );
  }
}

/**
 * ClassManager - Component to manage CSS classes for an entity
 * Allows adding, editing, and deleting CSS classes via dropdown and prompt
 * Shows all classes in the scene for easy selection
 */
class ClassManager extends React.Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      classes: this.getClasses(props.entity),
      availableClasses: this.getAllSceneClasses(),
      selectedClass: '',
      entityId: props.entity.id,
      newClassName: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Handle null entity
    if (!props.entity) {
      return null;
    }

    // Always sync classes from the entity to ensure we have the latest state
    const currentClasses = props.entity.getAttribute('class') || '';
    const currentClassesArray = currentClasses.split(/\s+/).filter(c => c.length > 0);
    const storedClassesStr = state.classes.join(' ');

    // Also get fresh available classes from scene
    const availableClasses = ClassManager.getAllSceneClassesStatic();

    // Sync if classes are different
    if (storedClassesStr !== currentClasses) {
      return {
        classes: currentClassesArray,
        availableClasses: availableClasses,
        selectedClass: '',
        entityId: props.entity.id
      };
    }

    return null;
  }

  componentDidMount() {
    Events.on('entityupdate', this.onEntityUpdate);
    Events.on('entityclone', this.onEntityUpdate);
    Events.on('entityselected', this.onEntitySelected);
    // Refresh available classes periodically
    this.refreshInterval = setInterval(() => {
      this.setState({ availableClasses: ClassManager.getAllSceneClassesStatic() });
    }, 2000);
  }

  componentWillUnmount() {
    Events.off('entityupdate', this.onEntityUpdate);
    Events.off('entityclone', this.onEntityUpdate);
    Events.off('entityselected', this.onEntitySelected);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  static getAllSceneClassesStatic() {
    if (!AFRAME || !AFRAME.scenes || !AFRAME.scenes[0]) {
      return [];
    }

    try {
      const scene = AFRAME.scenes[0];
      const allEntities = scene.querySelectorAll('*');
      const classSet = new Set();

      allEntities.forEach(el => {
        if (el.classList && el.classList.length > 0) {
          el.classList.forEach(cls => classSet.add(cls));
        }
      });

      return Array.from(classSet).sort();
    } catch (e) {
      console.warn('Error getting scene classes:', e);
      return [];
    }
  }

  getAllSceneClasses() {
    return ClassManager.getAllSceneClassesStatic();
  }

  onEntitySelected = (entity) => {
    // Refresh classes when a new entity is selected
    if (entity === this.props.entity) {
      this.setState({
        classes: this.getClasses(this.props.entity),
        availableClasses: this.getAllSceneClasses(),
        selectedClass: ''
      });
    }
  };

  onEntityUpdate = (detail) => {
    if (detail.entity !== this.props.entity) {
      return;
    }
    // Update when class attribute changes
    if (detail.component === 'class' || detail.property === 'class') {
      this.setState({
        classes: this.getClasses(this.props.entity),
        availableClasses: this.getAllSceneClasses()
      });
    }
  };

  getClasses(entity) {
    const classAttr = entity.getAttribute('class');
    if (!classAttr) return [];
    return classAttr.split(/\s+/).filter(c => c.length > 0);
  }

  updateEntityClasses(classes) {
    const classString = classes.join(' ');
    this.props.entity.setAttribute('class', classString);
    Events.emit('entityupdate', {
      entity: this.props.entity,
      component: 'class',
      property: '',
      value: classString
    });
  }

  handleSelectChange = (event) => {
    const selectedClass = event.target.value;

    if (!selectedClass) {
      this.setState({ selectedClass: '' });
      return;
    }

    // Check if this is an existing class to remove
    if (this.state.classes.includes(selectedClass)) {
      // Remove class (toggle behavior)
      this.handleDeleteClass(selectedClass);
    } else {
      // Add new class
      this.handleAddExistingClass(selectedClass);
    }

    // Reset selection
    this.setState({ selectedClass: '' });
  };

  handleAddExistingClass = (className) => {
    const { classes } = this.state;
    if (!classes.includes(className)) {
      const newClasses = [...classes, className];
      this.updateEntityClasses(newClasses);
      this.setState({ classes: newClasses });
    }
  };

  handleAddClass = () => {
    const { newClassName, classes } = this.state;

    if (newClassName && newClassName.trim()) {
      const trimmedName = newClassName.trim();

      if (!classes.includes(trimmedName)) {
        const newClasses = [...classes, trimmedName];
        this.updateEntityClasses(newClasses);
        this.setState({
          classes: newClasses,
          availableClasses: this.getAllSceneClasses(),
          newClassName: ''
        });
      }
    }
  };

  handleDeleteClass = (classToDelete) => {
    const { classes } = this.state;
    const newClasses = classes.filter(c => c !== classToDelete);
    this.updateEntityClasses(newClasses);
    this.setState({ classes: newClasses });
  };

  render() {
    const { classes, availableClasses, newClassName } = this.state;

    return (
      <div className="class-manager-list">
        <div className="class-items">
          {classes.length === 0 && (
            <div className="class-empty">No classes assigned</div>
          )}
          {classes.map((className) => (
            <div key={className} className="class-item">
              <span className="class-name">{className}</span>
              <button
                className="class-delete-btn"
                onClick={() => this.handleDeleteClass(className)}
                title="Delete class"
              >
                <AwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
        <div className="class-add">
          <input
            type="text"
            className="class-add-input"
            placeholder="Add class..."
            value={newClassName}
            onChange={(e) => this.setState({ newClassName: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.handleAddClass();
            }}
          />
          <button
            className="class-add-button"
            onClick={this.handleAddClass}
            title="Add class"
          >
            <AwesomeIcon icon={faPlus} />
          </button>
        </div>
        {availableClasses.length > 0 && (
          <div className="class-available">
            <div className="class-available-label">Available classes in scene:</div>
            <div className="class-available-items">
              {availableClasses
                .filter(c => !classes.includes(c))
                .map((className) => (
                  <button
                    key={className}
                    className="class-available-item"
                    onClick={() => this.handleAddExistingClass(className)}
                    title="Add to entity"
                  >
                    + {className}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
