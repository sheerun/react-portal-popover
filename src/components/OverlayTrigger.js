import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from '../utils';

class OverlayTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: uniqueId(),
    };
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.onClose = this.onClose.bind(this);
    this.addCloseHandler = this.addCloseHandler.bind(this);
    this.removeCloseHandler = this.removeCloseHandler.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.accessibleLabel = this.accessibleLabel.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  addCloseHandler() {
    document.addEventListener('click', this.onClickOutside);
    window.addEventListener('resize', this.onClickOutside);
    if (this.props.closeOnScroll) {
      // Use capture for scroll events
      window.addEventListener('scroll', this.onScroll, true);
    }
  }

  removeCloseHandler() {
    document.removeEventListener('click', this.onClickOutside);
    window.removeEventListener('resize', this.onClickOutside);
    window.removeEventListener('scroll', this.onScroll, true);
  }
  componentDidMount() {
    this.isNodeMounted = true;
  }

  componentDidUpdate() {

  }

  componentWillUnmount() {
    this.isNodeMounted = false;
    this.removeCloseHandler();
  }

  toggleOverlay() {
    this.setState({
      open: !this.state.open,
    }, () => {
      if (this.state.open) {
        this.addCloseHandler();
      } else {
        this.removeCloseHandler();
      }
    });
  }

  onClose() {
    setTimeout(() => {
      if (this.isNodeMounted) {
        this.setState({
          open: false,
        });
        this.removeCloseHandler();
      }
    }, 0);
  }

  onScroll() {
    this.setState({
      open: false,
    });
  }

  onClickOutside() {
    this.removeCloseHandler();
    this.setState({
      open: false,
    });
  }

  accessibleLabel(children) {
    if (this.props.showLabel && this.props.hideLabel) {
      const label = (
        <span className="u-accessible">
          {this.state.open ? this.props.hideLabel : this.props.showLabel}
        </span>
      );
      return [label, children];
    }
    return children;
  }

  render() {
    const { children } = this.props;

    if (!children || !this.props.overlay) {
      return <span />;
    }

    const triggerId = children.id || `trigger_${this.state.id}`;

    const trigger = React.cloneElement(children, {
      onClick: this.toggleOverlay,
      'aria-controls': this.state.id,
      'aria-owns': this.state.id,
      'aria-expanded': this.state.open,
      'aria-haspopup': true,
      id: triggerId,
      children: this.accessibleLabel(children.props.children),
      ref: (ref) => { this.trigger = ref; },
    });

    const overlay = React.cloneElement(this.props.overlay, {
      trigger: this.trigger || null,
      isOpened: this.state.open,
      onClose: this.onClose,
      id: this.state.id,
      label: this.props.label || '',
    });

    return (
      <span>
        {trigger}
        {overlay}
      </span>
    );
  }
}

OverlayTrigger.propTypes = {
  closeOnScroll: PropTypes.bool,
  children: PropTypes.element.isRequired,
  overlay: PropTypes.object.isRequired,
  hideLabel: PropTypes.string,
  showLabel: PropTypes.string,
  label: PropTypes.string,
};

export default OverlayTrigger;
