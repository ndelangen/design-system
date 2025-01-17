import React, { KeyboardEvent, MouseEvent } from 'react';
import PropTypes from 'prop-types';

import { TabProps } from './Tabs.types';
import { TabVariants } from './Tabs.enums';
import { ColorTypes } from '../../theme/colors.enums';
import { requireRouterLink } from '../../utils/require-router-link';
import { SpaceSizes } from '../../theme/space.enums';
import { PaddingTypes } from '../layout/Padbox/Padbox.enums';
import BaseTabLabel from '../_internal/BaseTabs/BaseTabLabel';

const Tab: React.FC<TabProps> = ({
  children,
  color,
  onClick,
  value,
  __variant,
  __isExpanded,
  __isSelected,
  __onSelectTab,
}) => {
  const isLink = value?.toString()?.startsWith('/');
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      __onSelectTab(value);
    }
  };
  const handler = isLink
    ? { to: value, onClick }
    : {
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          __onSelectTab(value);
          onClick?.(e);
        },
        onKeyDown: (e: KeyboardEvent<HTMLAnchorElement>) => {
          handleKeyDown(e);
        },
      };
  let RouterLink = null;

  if (isLink) {
    RouterLink = requireRouterLink();
  }

  const paddingSize =
    __variant === TabVariants.segmented
      ? SpaceSizes.sm
      : __variant === TabVariants.underline
      ? SpaceSizes.md
      : SpaceSizes.none;

  return (
    <BaseTabLabel
      $color={color}
      $isExpanded={__isExpanded}
      $isSelected={__isSelected}
      $variant={__variant}
      aria-selected={__isSelected}
      as={isLink ? RouterLink : 'a'}
      paddingSize={paddingSize}
      paddingType={PaddingTypes.squish}
      role="tab"
      tabIndex={0}
      {...handler}
    >
      {children}
    </BaseTabLabel>
  );
};

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.oneOf([...Object.values(ColorTypes)]),
  __variant: PropTypes.oneOf(Object.values(TabVariants)),
  // eslint-disable-next-line
  __isSelected: PropTypes.bool,
  // eslint-disable-next-line
  __isExpanded: PropTypes.bool,
  __onSelectTab: PropTypes.func, // internal property
  onClick: PropTypes.func,
};

export default Tab;
