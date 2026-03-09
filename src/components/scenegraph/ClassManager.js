import React from 'react';
import {
  faPlus,
  faTrashAlt,
  faPencilAlt,
  faTimes,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import Events from '../../lib/Events';

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
      classEntities: []
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
      classEntities: classItem.elements
    });
  };

  clearSelection = () => {
    this.setState({ selectedClass: null, classEntities: [] });
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
    const { selectedClass, classEntities } = this.state;

    if (!selectedClass) return null;

    return (
      <div className="class-detail">
        <div className="class-detail-header">
          <h4>Class: {selectedClass.name}</h4>
          <button className="btn icon-only" onClick={this.clearSelection} title="Close">
            <AwesomeIcon icon={faTimes} />
          </button>
        </div>
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
