import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { includes } from 'ramda';
import cls from 'classnames';

import { IconTypes, SSCIconNames } from '../../theme/icons/icons.enums';
import { getColor, getRadii, pxToRem } from '../../utils';
import { Icon } from '../Icon';
import { Strong, Text } from '../typographyLegacy';
import { TextSizes, TextVariants } from '../typographyLegacy/Text/Text.enums';
import { CollapsibleProps } from './Collapsible.types';
import { Padbox } from '../layout/Padbox';
import { Inline } from '../layout/Inline';
import { SpaceSizes } from '../../theme/space.enums';
import { PaddingTypes } from '../layout/Padbox/Padbox.enums';
import { CLX_COMPONENT } from '../../theme/constants';

const Header = styled(Padbox)`
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 4%);
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 4px solid ${getColor('primary.200')};
    border-radius: 4px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Content = styled(Padbox)`
  border-top: 1px solid ${getColor('neutral.400')};
`;

const Container = styled.div`
  border: 1px solid ${getColor('neutral.400')};
  border-radius: ${getRadii('default')};
`;

const Subject = styled(Strong)`
  display: block;
  margin-top: ${pxToRem(4)};
`;

const StyledIcon = styled(Icon).withConfig<{ isRotated: boolean }>({
  shouldForwardProp: (property) => !includes(property, ['isRotated']),
})`
  transition: transform 200ms;
  ${({ isRotated }) => isRotated && 'transform: rotate(90deg);'}
`;

const Collapsible: React.FC<CollapsibleProps> = ({
  children,
  className,
  defaultIsOpened = false,
  subject,
  title,
  onOpen,
}) => {
  const [isOpen, setOpen] = useState(defaultIsOpened);

  const handleHeaderClick = () => {
    const willOpen = !isOpen;
    setOpen(willOpen);
    if (typeof onOpen === 'function' && willOpen) {
      onOpen();
    }
  };

  return (
    <Container className={cls(CLX_COMPONENT, className)}>
      <Header
        paddingSize={SpaceSizes.mdPlus}
        paddingType={PaddingTypes.squish}
        tabIndex={0}
        onClick={handleHeaderClick}
        onKeyDown={(e) => ['Enter', ' '].includes(e.key) && handleHeaderClick()}
      >
        <Inline align="center" gap={SpaceSizes.md}>
          <StyledIcon
            isRotated={isOpen}
            name={SSCIconNames.angleRight}
            type={IconTypes.ssc}
          />
          <HeaderContent>
            <Text as="div" size={TextSizes.md} variant={TextVariants.secondary}>
              {title}
            </Text>
            {subject && <Subject size={TextSizes.lg}>{subject}</Subject>}
          </HeaderContent>
        </Inline>
      </Header>
      {isOpen && (
        <Content paddingSize={SpaceSizes.lg} paddingType={PaddingTypes.squish}>
          <Text as="div" size={TextSizes.md}>
            {children}
          </Text>
        </Content>
      )}
    </Container>
  );
};

Collapsible.propTypes = {
  subject: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  className: PropTypes.string,
  defaultIsOpened: PropTypes.bool,
  onOpen: PropTypes.func,
};

export default Collapsible;
