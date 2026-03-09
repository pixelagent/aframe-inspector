import React from 'react';
import PropTypes from 'prop-types';
import { faClipboard, faTrashAlt, faAngleDown, faAngleRight, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import PropertyRow from './PropertyRow';
import Collapsible from '../Collapsible';
import copy from 'clipboard-copy';
import { getComponentClipboardRepresentation } from '../../lib/entity';
import { shouldShowProperty } from '../../lib/utils';
import { isBeginnerComponent, isBeginnerProperty, getComponentOverview } from '../../lib/componentHelp';
import ComponentHelpModal from '../modals/ComponentHelpModal';
import Events from '../../lib/Events';

const isSingleProperty = AFRAME.schema.isSingleProperty;

/**
 * Single component.
 */
export default class Component extends React.Component {
  static propTypes = {
    component: PropTypes.any,
    entity: PropTypes.object,
    isCollapsed: PropTypes.bool,
    name: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      entity: this.props.entity,
      name: this.props.name,
      showAdvanced: false,
      showHelpModal: false
    };
  }

  onEntityUpdate = (detail) => {
    if (detail.entity !== this.props.entity) {
      return;
    }
    if (detail.component === this.props.name) {
      this.forceUpdate();
    }
  };

  componentDidMount() {
    Events.on('entityupdate', this.onEntityUpdate);
  }

  componentWillUnmount() {
    Events.off('entityupdate', this.onEntityUpdate);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.entity !== props.entity) {
      return { entity: props.entity };
    }
    if (state.name !== props.name) {
      return { name: props.name };
    }
    return null;
  }

  removeComponent = (event) => {
    var componentName = this.props.name;
    event.stopPropagation();
    if (
      confirm('Do you really want to remove component `' + componentName + '`?')
    ) {
      this.props.entity.removeAttribute(componentName);
      Events.emit('componentremove', {
        entity: this.props.entity,
        component: componentName
      });
    }
  };

  /**
   * Render propert(ies) of the component.
   */
  renderPropertyRows = () => {
    const componentData = this.props.component;
    const componentName = this.props.name;
    const baseName = componentName.split('__')[0];
    const isBeginnerMode = isBeginnerComponent(baseName);
    const { showAdvanced } = this.state;

    if (isSingleProperty(componentData.schema)) {
      return (
        <PropertyRow
          key={componentName}
          name={componentName}
          schema={AFRAME.components[baseName].schema}
          data={componentData.data}
          componentname={componentName}
          isSingle={true}
          entity={this.props.entity}
        />
      );
    }

    const propertyNames = Object.keys(componentData.schema)
      .sort()
      .filter((propertyName) => shouldShowProperty(propertyName, componentData));

    // Separate beginner and advanced properties
    const beginnerProps = [];
    const advancedProps = [];

    propertyNames.forEach(propertyName => {
      if (isBeginnerMode && !showAdvanced) {
        if (isBeginnerProperty(componentName, propertyName)) {
          beginnerProps.push(propertyName);
        } else {
          advancedProps.push(propertyName);
        }
      } else {
        // Show all properties
        beginnerProps.push(propertyName);
      }
    });

    const renderRow = (propertyName) => (
      <PropertyRow
        key={propertyName}
        name={propertyName}
        schema={componentData.schema[propertyName]}
        data={componentData.data[propertyName]}
        componentname={this.props.name}
        isSingle={false}
        entity={this.props.entity}
      />
    );

    return (
      <>
        {beginnerProps.map(renderRow)}
        {isBeginnerMode && advancedProps.length > 0 && (
          <div className="showMoreContainer">
            <button
              className="showMoreButton"
              onClick={() => this.setState({ showAdvanced: !showAdvanced })}
            >
              <AwesomeIcon icon={showAdvanced ? faAngleRight : faAngleDown} />
              {showAdvanced ? 'Show Less' : `Show More (${advancedProps.length} advanced)`}
            </button>
          </div>
        )}
        {showAdvanced && advancedProps.map(renderRow)}
      </>
    );
  };

  render() {
    const componentName = this.props.name;
    const baseName = componentName.split('__')[0];
    const componentOverview = getComponentOverview(baseName);
    const { showHelpModal } = this.state;

    return (
      <>
        <Collapsible collapsed={this.props.isCollapsed}>
          <div className="componentHeader collapsible-header">
            <span className="componentTitle" title={componentName}>
              <span>{componentName}</span>
            </span>
            <div className="componentHeaderActions">
              {componentOverview && (
                <a
                  title="Click for help"
                  className="button componentHelpButton"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({ showHelpModal: true });
                  }}
                >
                  <AwesomeIcon icon={faQuestionCircle} />
                </a>
              )}
              <a
                title="Copy to clipboard"
                className="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  copy(
                    getComponentClipboardRepresentation(
                      this.state.entity,
                      componentName.toLowerCase()
                    )
                  );
                }}
              >
                <AwesomeIcon icon={faClipboard} />
              </a>
              <a
                title="Remove component"
                className="button"
                onClick={this.removeComponent}
              >
                <AwesomeIcon icon={faTrashAlt} />
              </a>
            </div>
          </div>
          <div className="collapsible-content">{this.renderPropertyRows()}</div>
        </Collapsible>
        <ComponentHelpModal
          isOpen={showHelpModal}
          componentName={baseName}
          onClose={() => this.setState({ showHelpModal: false })}
        />
      </>
    );
  }
}
