import React from 'react';
import {
  faPlus,
  faTrashAlt,
  faPencilAlt,
  faTimes,
  faTag,
  faCheck,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Events from '../../lib/Events';
import Collapsible from '../Collapsible';

/**
 * ClassManager - Panel for viewing CSS classes in the scene
 *
 * Allows users to select CSS classes and see which entities use them and their components
 */
export default class ClassManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      classes: [],
      selectedClass: null,
      classEntities: [],
      editingClassName: '',
      isEditing: false
    };
  }

  componentDidMount() {
    this.loadClasses();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      if (this.state.isOpen) {
        this.setState({ isOpen: false, selectedClass: null });
      }
    }
  };

  loadClasses = () => {
    if (!AFRAME || !AFRAME.scenes || !AFRAME.scenes[0]) {
      this.setState({ classes: [] });
      return;
    }

    const scene = AFRAME.scenes[0];
    const allEntities = scene.querySelectorAll('*');
    const classMap = new Map();

    allEntities.forEach(el => {
      if (el.classList && el.classList.length > 0) {
        const classNames = Array.from(el.classList);
        classNames.forEach(className => {
          if (!classMap.has(className)) {
            classMap.set(className, []);
          }
          classMap.get(className).push(el);
        });
      }
    });

    // Convert to array and sort by name
    const classes = Array.from(classMap.entries())
      .map(([name, elements]) => ({
        name,
        count: elements.length,
        elements
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.setState({ classes });
  };

  selectClass = (classItem) => {
    this.setState({
      selectedClass: classItem,
      classEntities: classItem.elements,
      editingClassName: classItem.name,
      isEditing: false
    });
  };

  clearSelection = () => {
    this.setState({ selectedClass: null, classEntities: [], isEditing: false });
  };

  startEditing = (e) => {
    e.stopPropagation();
    this.setState({ isEditing: true });
  };

  cancelEditing = (e) => {
    e.stopPropagation();
    this.setState({
      isEditing: false,
      editingClassName: this.state.selectedClass?.name || ''
    });
  };

  handleClassNameChange = (e) => {
    this.setState({ editingClassName: e.target.value });
  };

  saveClassName = () => {
    const { selectedClass, editingClassName, classEntities } = this.state;
    if (!selectedClass || !editingClassName.trim()) return;

    const oldClassName = selectedClass.name;
    const newClassName = editingClassName.trim();

    if (oldClassName === newClassName) {
      this.setState({ isEditing: false });
      return;
    }

    // Update all entities with the new class name
    classEntities.forEach(el => {
      if (el.classList) {
        el.classList.remove(oldClassName);
        el.classList.add(newClassName);
      }
    });

    // Update selected class with new name
    const updatedClass = { ...selectedClass, name: newClassName };
    this.setState({
      selectedClass: updatedClass,
      isEditing: false
    });

    // Refresh the class list
    this.loadClasses();
  };

  togglePanel = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    if (!this.state.isOpen) {
      this.loadClasses();
    }
  };

  getEntityComponents = (el) => {
    const components = [];
    // Get all A-Frame components
    if (el.components) {
      Object.keys(el.components).forEach(compName => {
        if (compName !== 'mixin') {
          const comp = el.components[compName];
          if (comp && comp.schema) {
            // Get component data
            const data = comp.data;
            let valueStr = '';
            if (typeof data === 'object') {
              valueStr = Object.entries(data)
                .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                .join(', ');
            } else {
              valueStr = String(data);
            }
            components.push({ name: compName, value: valueStr });
          }
        }
      });
    }
    return components;
  };

  selectEntity = (el) => {
    // Emit event to select this entity in the scene graph
    Events.emit('select', { el });
  };

  renderClassList() {
    const { classes, isOpen } = this.state;

    if (!isOpen) return null;

    return (
      <div className="class-panel">
        <div className="class-header">
          <span>CSS Classes ({classes.length})</span>
          <button className="btn icon-only" onClick={this.loadClasses} title="Refresh">
            <AwesomeIcon icon={faPencilAlt} />
          </button>
        </div>
        <div className="class-list">
          {classes.length === 0 ? (
            <div className="no-classes">No CSS classes in scene</div>
          ) : (
            classes.map(classItem => (
              <div
                key={classItem.name}
                className={`class-item ${this.state.selectedClass?.name === classItem.name ? 'selected' : ''}`}
                onClick={() => this.selectClass(classItem)}
              >
                <span className="class-name">{classItem.name}</span>
                <span className="class-count">{classItem.count} entity(s)</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  renderClassDetail() {
    const { selectedClass, classEntities, editingClassName, isEditing } = this.state;

    if (!selectedClass) return null;

    const accordionHeader = (
      <div className="class-detail-header">
        {isEditing ? (
          <div className="class-name-edit">
            <input
              type="text"
              value={editingClassName}
              onChange={this.handleClassNameChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') this.saveClassName();
                if (e.key === 'Escape') this.cancelEditing(e);
              }}
              autoFocus
              className="class-name-input"
            />
            <button
              className="btn icon-only save-btn"
              onClick={this.saveClassName}
              title="Save"
            >
              <AwesomeIcon icon={faCheck} />
            </button>
            <button
              className="btn icon-only cancel-btn"
              onClick={this.cancelEditing}
              title="Cancel"
            >
              <AwesomeIcon icon={faUndo} />
            </button>
          </div>
        ) : (
          <>
            <h4>
              <span className="label">Class:</span>
              <span className="value">{selectedClass.name}</span>
              <span className="count">({selectedClass.count} entity(s))</span>
            </h4>
            <div className="header-actions">
              <button className="btn icon-only" onClick={this.startEditing} title="Edit class name">
                <AwesomeIcon icon={faPencilAlt} />
              </button>
              <button className="btn icon-only" onClick={this.clearSelection} title="Close">
                <AwesomeIcon icon={faTimes} />
              </button>
            </div>
          </>
        )}
      </div>
    );

    const accordionContent = (
      <div className="class-entities">
        {classEntities.map((el, idx) => {
          const components = this.getEntityComponents(el);
          const entityName = el.getAttribute('id') || el.tagName.toLowerCase();
          return (
            <div key={idx} className="class-entity-item">
              <div
                className="class-entity-header"
                onClick={() => this.selectEntity(el)}
                title="Click to select entity"
              >
                <span className="entity-name">{entityName}</span>
                <span className="entity-tag">{el.tagName.toLowerCase()}</span>
              </div>
              {components.length > 0 && (
                <div className="entity-components">
                  {components.map((comp, compIdx) => (
                    <div key={compIdx} className="component-item">
                      <span className="comp-name">{comp.name}</span>
                      <span className="comp-value">{comp.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="class-detail">
        <Collapsible collapsed={false}>
          {accordionHeader}
          {accordionContent}
        </Collapsible>
      </div>
    );
  }

  render() {
    return (
      <div className="class-manager">
        <button
          className="class-toggle"
          onClick={this.togglePanel}
          title="View CSS Classes"
        >
          <AwesomeIcon icon={faTag} />
          <span>Classes</span>
        </button>

        {this.state.isOpen && (
          <div className="class-panel-container">
            {this.renderClassList()}
            {this.renderClassDetail()}
          </div>
        )}
      </div>
    );
  }
}
