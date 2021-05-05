import { isNotNull, isNotUndefined } from 'ramda-adjunct';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import usePortal from 'react-cool-portal';

import { useCalculatePortaPlacement } from './useCalculatePortalPlacement';
import { StyleProps } from './useCalculatePortalPlacement.types';
import { PortalPlacements } from './useCalculatePortalPlacements.enums';
import DropdownPane from './components/DropdownPane';
import { UseDropdownOptions, UseDropdownReturnType } from './useDropdown.types';

const defaultTooltipPopupDimensions = { space: 8 };

export const useDropdown = (
  parentRef: React.MutableRefObject<HTMLSpanElement>,
  {
    defaultIsPaneDisplayed = false,
    paneWidth = 140,
    onClickOut,
    placement = PortalPlacements.bottom,
    isElevated = false,
  }: UseDropdownOptions,
): UseDropdownReturnType => {
  const { Portal, isShow, show, hide, toggle } = usePortal({
    defaultShow: defaultIsPaneDisplayed,
  });
  const [style, setStyle] = useState<StyleProps>({
    width: paneWidth,
    ...defaultTooltipPopupDimensions,
  });
  const getPlacementStyles = useCalculatePortaPlacement(parentRef, {
    placement,
    width: paneWidth,
    ...defaultTooltipPopupDimensions,
  });
  const scrollListener = useRef(null);
  const isListenerAdded = useRef(false);

  useEffect(() => {
    setStyle(getPlacementStyles());
  }, [getPlacementStyles, isShow]);

  const handleOnClickOut = useCallback(() => {
    if (isNotUndefined(onClickOut)) {
      onClickOut();
    }
    hide();
  }, [hide, onClickOut]);

  useEffect(() => {
    scrollListener.current = () => {
      handleOnClickOut();
      window.removeEventListener('scroll', scrollListener.current);
      isListenerAdded.current = false;
    };

    if (isListenerAdded.current && isNotNull(scrollListener.current)) {
      window.removeEventListener('scroll', scrollListener.current);
      isListenerAdded.current = false;
    }

    window.addEventListener('scroll', scrollListener.current);
    isListenerAdded.current = true;
    return () => {
      window.removeEventListener('scroll', scrollListener.current);
    };
  }, [handleOnClickOut]);

  return {
    handleToggleDropdown: toggle,
    handleShowDropdown: show,
    handleHideDropdown: hide,
    isPaneDisplayed: isShow,
    Pane: ({ children }) => (
      <Portal>
        <DropdownPane
          isElevated={isElevated}
          onClickOut={handleOnClickOut}
          {...style}
        >
          {children}
        </DropdownPane>
      </Portal>
    ),
  };
};