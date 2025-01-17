import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'ramda-adjunct';
import { Ref } from '@fluentui/react-component-ref';

import { SpaceSizes } from '../../theme';
import { PaddingTypes } from '../layout/Padbox/Padbox.enums';
import { DropdownProps } from './Dropdown.types';
import { DropdownPlacements, DropdownTriggerEvents } from './Dropdown.enums';
import ControlledDropdown from './ControlledDropdown';
import { CLX_COMPONENT } from '../../theme/constants';

const Dropdown: React.FC<DropdownProps> = React.forwardRef(
  (
    {
      children,
      trigger,
      triggerEvents = [DropdownTriggerEvents.click],
      placement = DropdownPlacements.bottomStart,
      innerPaddingSize = SpaceSizes.md,
      innerPaddingType = PaddingTypes.square,
      maxPaneWidth = 270,
      isPaneElevated = false,
      hasPaneArrow = false,
      hoverHideDelay = 250,
      defaultIsOpen = false,
      onClose = noop,
      onOpen = noop,
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(defaultIsOpen);
    const [triggerEl, setTriggerEl] = useState(null);
    const timeoutId = useRef(null);

    const showPane = () => {
      onOpen();
      setIsVisible(true);
    };

    const hidePane = () => {
      onClose();
      setIsVisible(false);
    };
    const togglePane = () => {
      isVisible === true ? hidePane() : showPane();
    };

    useImperativeHandle(ref, () => ({
      togglePane,
      hidePane,
      showPane,
    }));

    // eslint-disable-next-line
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (!triggerEvents.includes('click')) {
          return;
        }
        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            hidePane();
            break;
          default:
        }
      };
      if (isVisible) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
      // eslint-disable-next-line
    }, [isVisible]);

    const handleTriggerOnClick = () => {
      if (!triggerEvents.includes('click')) {
        return;
      }
      togglePane();
    };

    const handleTriggerOnKeyDown: React.KeyboardEventHandler = (e) => {
      if (!triggerEvents.includes('click')) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          togglePane();
          break;
        default:
      }
    };

    const handleTriggerOnMouseEnter = () => {
      if (!triggerEvents.includes('hover')) {
        return;
      }
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      showPane();
    };
    const handleTriggerOnMouseLeave = () => {
      if (!triggerEvents.includes('hover')) {
        return;
      }
      timeoutId.current = setTimeout(hidePane, hoverHideDelay);
    };
    const handleTriggerOnFocus = () => {
      if (!triggerEvents.includes('focus')) {
        return;
      }
      showPane();
    };
    const handleTriggerOnBlur = () => {
      if (!triggerEvents.includes('focus')) {
        return;
      }
      hidePane();
    };

    const isFocusTrapEnabled = triggerEvents.includes(
      DropdownTriggerEvents.click,
    );

    return (
      <>
        <Ref innerRef={setTriggerEl}>
          {React.cloneElement(trigger, {
            onClick: handleTriggerOnClick,
            onTouchStart: handleTriggerOnClick,
            onKeyDown: handleTriggerOnKeyDown,
            onPointerEnter: handleTriggerOnMouseEnter,
            onPointerLeave: handleTriggerOnMouseLeave,
            onFocus: handleTriggerOnFocus,
            onBlur: handleTriggerOnBlur,
          })}
        </Ref>
        <ControlledDropdown
          className={CLX_COMPONENT}
          focusTrap={isFocusTrapEnabled}
          hasPaneArrow={hasPaneArrow}
          innerPaddingSize={innerPaddingSize}
          innerPaddingType={innerPaddingType}
          isOpen={isVisible}
          isPaneElevated={isPaneElevated}
          maxPaneWidth={maxPaneWidth}
          placement={placement}
          triggerEl={triggerEl}
          onClickOut={hidePane}
          onMouseEnter={handleTriggerOnMouseEnter}
          onMouseLeave={handleTriggerOnMouseLeave}
        >
          {children}
        </ControlledDropdown>
      </>
    );
  },
);

Dropdown.propTypes = {
  trigger: PropTypes.element.isRequired,
  triggerEvents: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(DropdownTriggerEvents)),
  ),
  placement: PropTypes.oneOf(Object.values(DropdownPlacements)),
  innerPaddingSize: PropTypes.oneOf(Object.values(SpaceSizes)),
  innerPaddingType: PropTypes.oneOf(Object.values(PaddingTypes)),
  maxPaneWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf<'auto'>(['auto']),
  ]),
  isPaneElevated: PropTypes.bool,
  hasPaneArrow: PropTypes.bool,
  hoverHideDelay: PropTypes.number,
  defaultIsOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

export default Dropdown;
