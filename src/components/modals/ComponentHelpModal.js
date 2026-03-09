import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { getComponentFullHelp } from '../../lib/componentHelp';

export default class ComponentHelpModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    componentName: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      componentName: this.props.componentName
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isOpen !== props.isOpen || state.componentName !== props.componentName) {
      return { isOpen: props.isOpen, componentName: props.componentName };
    }
    return null;
  }

  onClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { componentName } = this.state;
    const help = componentName ? getComponentFullHelp(componentName) : null;

    return (
      <Modal
        id="componentHelpModal"
        title={help ? `Help: ${help.title}` : 'Component Help'}
        isOpen={this.state.isOpen}
        onClose={this.onClose}
      >
        {help ? (
          <div className="component-help-modal">
            <div className="help-overview">
              <h4>Overview</h4>
              <p>{help.overview}</p>
            </div>

            {help.beginnerProperties && help.beginnerProperties.length > 0 && (
              <div className="help-properties">
                <h4>Beginner Properties</h4>
                <p className="help-tip">
                  These are the essential properties shown by default. Click "More" to see all properties.
                </p>
                <ul>
                  {help.beginnerProperties.map((prop) => (
                    <li key={prop} className="help-property">
                      <span className="property-name">{prop}</span>
                      <span className="property-desc">
                        {help.descriptions[prop] || 'No description available'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {help.descriptions && Object.keys(help.descriptions).length > 0 && (
              <div className="help-all-properties">
                <h4>All Properties</h4>
                <ul>
                  {Object.entries(help.descriptions).map(([prop, desc]) => (
                    <li key={prop} className="help-property">
                      <span className="property-name">{prop}</span>
                      <span className="property-desc">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!help.beginnerProperties || help.beginnerProperties.length === 0 ? (
              <div className="help-no-beginner">
                <p>
                  This component has no specific beginner properties configured.
                  All available properties are shown by default.
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="component-help-modal">
            <p>No help available for this component.</p>
            <p className="help-tip">
              Click the help icon (?) next to a component in the sidebar to see its documentation.
            </p>
          </div>
        )}
      </Modal>
    );
  }
}
