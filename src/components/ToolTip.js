import React from 'react';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';

import PositionProvider from './PositionProvider';

import {
  SIZE,
  FOREGROUND,
  BORDER_COLOUR,
  POSITION,
  BORDER_WIDTH,
  USE_FOREGROUND,
  CLASS_BASE,
  DEFAULT_ARROW_MARGIN,
} from '../constants';

const ToolTip = (props) => {
  const defaults = {
    classBase: CLASS_BASE,
    className: '',
    size: SIZE,
    offset: DEFAULT_ARROW_MARGIN,
    foregroundColor: FOREGROUND,
    color: BORDER_COLOUR,
    position: props.position || POSITION,
    borderWidth: BORDER_WIDTH,
    useForeground: USE_FOREGROUND,
  };

  const options = Object.assign({}, defaults, props.options);
  const classes = `${options.classBase} ${options.classBase}--${options.position} ${options.className}`;

  const style = {};

  if (props.readonly) {
    style.cursor = 'default';
  }

  return (<div>
    <Portal
      closeOnEsc
      closeOnOutsideClick
      isOpened={props.isOpened}
      onClose={props.onClose}
    >
      <PositionProvider
        position={options.position}
        label={props.label}
        id={props.id}
        arrowSize={options.size}
        arrowOffset={options.offset}
        target={props.trigger}
        options={options}
        classes={classes}
        style={style}
      >
        {props.children}
      </PositionProvider>
    </Portal>
  </div>);
};

ToolTip.propTypes = {
  isOpened: PropTypes.bool,
  readonly: PropTypes.bool,
  small: PropTypes.bool,
  onClose: PropTypes.func,
  trigger: PropTypes.object,
  id: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  position: PropTypes.string,
  size: PropTypes.number,
  options: PropTypes.object,
};

export default ToolTip;
