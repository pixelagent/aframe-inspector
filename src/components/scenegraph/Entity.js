/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import {
  faCaretDown,
  faCaretRight,
  faClone,
  faEye,
  faEyeSlash,
  faTrashAlt,
  faArrowUp,
  faArrowDown,
  faCodeBranch
} from '@fortawesome/free-solid-svg-icons';
import { AwesomeIcon } from '../AwesomeIcon';
import clsx from 'clsx';
import { removeEntity, cloneEntity, moveEntityUp, moveEntityDown } from '../../lib/entity';
import EntityRepresentation from '../EntityRepresentation';
import Events from '../../lib/Events';

export default class Entity extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    depth: PropTypes.number,
    entity: PropTypes.object,
    isExpanded: PropTypes.bool,
    isFiltering: PropTypes.bool,
    isSelected: PropTypes.bool,
    selectEntity: PropTypes.func,
    toggleExpandedCollapsed: PropTypes.func
  };

  state = {
    showReparentMenu: false
  };

  onClick = () => this.props.selectEntity(this.props.entity);

  onDoubleClick = () => Events.emit('objectfocus', this.props.entity.object3D);

  toggleVisibility = () => {
    const entity = this.props.entity;
    const visible = entity.object3D.visible;
    entity.setAttribute('visible', !visible);
  };

  handleMoveUp = (e) => {
    e.stopPropagation();
    moveEntityUp(this.props.entity);
  };

  handleMoveDown = (e) => {
    e.stopPropagation();
    moveEntityDown(this.props.entity);
  };

  handleReparent = (e) => {
    e.stopPropagation();
    // This will emit an event to show a modal/dropdown to select new parent
    Events.emit('entityreparent', this.props.entity);
  };

  render() {
    const isFiltering = this.props.isFiltering;
    const isExpanded = this.props.isExpanded;
    const entity = this.props.entity;
    const tagName = entity.tagName.toLowerCase();
    const isScene = tagName === 'a-scene';

    // Clone and remove buttons if not a-scene.
    const cloneButton = isScene ? null : (
      <a
        onClick={() => cloneEntity(entity)}
        title="Clone entity"
        className="button"
      >
        <AwesomeIcon icon={faClone} />
      </a>
    );

    const removeButton = isScene ? null : (
      <a
        onClick={(event) => {
          event.stopPropagation();
          removeEntity(entity);
        }}
        title="Remove entity"
        className="button"
      >
        <AwesomeIcon icon={faTrashAlt} />
      </a>
    );

    // Move up/down buttons
    const moveUpButton = isScene ? null : (
      <a
        onClick={this.handleMoveUp}
        title="Move up"
        className="button entityMoveUp"
      >
        <AwesomeIcon icon={faArrowUp} />
      </a>
    );

    const moveDownButton = isScene ? null : (
      <a
        onClick={this.handleMoveDown}
        title="Move down"
        className="button entityMoveDown"
      >
        <AwesomeIcon icon={faArrowDown} />
      </a>
    );

    // Reparent button
    const reparentButton = isScene ? null : (
      <a
        onClick={this.handleReparent}
        title="Change parent"
        className="button entityReparent"
      >
        <AwesomeIcon icon={faCodeBranch} />
      </a>
    );

    // Add spaces depending on depth.
    const pad = '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(this.props.depth);
    let collapse;
    if (entity.children.length > 0 && !isFiltering) {
      collapse = (
        <span
          onClick={() => this.props.toggleExpandedCollapsed(entity)}
          className="collapsespace"
        >
          {isExpanded ? (
            <AwesomeIcon icon={faCaretDown} />
          ) : (
            <AwesomeIcon icon={faCaretRight} />
          )}
        </span>
      );
    } else {
      collapse = <span className="collapsespace" />;
    }

    // Visibility button.
    const visible = entity.object3D.visible;
    const visibilityButton = (
      <i title="Toggle entity visibility" onClick={this.toggleVisibility}>
        {visible ? (
          <AwesomeIcon icon={faEye} />
        ) : (
          <AwesomeIcon icon={faEyeSlash} />
        )}
      </i>
    );

    // Class name.
    const className = clsx({
      active: this.props.isSelected,
      entity: true,
      novisible: !visible,
      option: true
    });

    return (
      <div className={className} onClick={this.onClick} id={this.props.id}>
        <span>
          {visibilityButton}
          <span
            className="entityChildPadding"
            dangerouslySetInnerHTML={{ __html: pad }}
          />
          {collapse}
          <EntityRepresentation
            entity={entity}
            onDoubleClick={this.onDoubleClick}
          />
        </span>
        <span className="entityActions">
          {reparentButton}
          {moveUpButton}
          {moveDownButton}
          {cloneButton}
          {removeButton}
        </span>
      </div>
    );
  }
}
