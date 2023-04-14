import type { FC } from 'react';
import type { CalloutProps } from './Callout.types';

import styled from 'styled-components';

import { ColorTypes, SpaceSizes } from '../../theme';
import { getColor, getFontSize, getRadii, pxToRem } from '../../utils';
import { Inline, Padbox } from '../layout';
import { Text } from '../typographyLegacy';
import { Icon } from '../Icon';
import { TextSizes } from '../typographyLegacy/Text/Text.enums';
import { SSCIconNames } from '../../theme/icons/icons.enums';
import { CLX_COMPONENT } from '../../theme/constants';

const IconContainer = styled.div`
  width: ${pxToRem(36)};
  height: ${pxToRem(36)};
  flex-shrink: 0;
  background-color: ${getColor(ColorTypes.info700)};
  border-radius: ${getRadii('circle')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${getFontSize('mdPlus')};
`;

const Container = styled(Padbox)`
  background-color: ${getColor(ColorTypes.info50)};
  border-radius: ${getRadii('default')};
`;

const Callout: FC<CalloutProps> = ({
  children,
  icon = SSCIconNames.lightbulb,
}) => (
  <Container className={CLX_COMPONENT} paddingSize={SpaceSizes.md}>
    <Inline gap={SpaceSizes.md}>
      <IconContainer>
        {typeof icon === 'string' ? (
          <Icon color={ColorTypes.neutral0} name={icon} />
        ) : (
          icon
        )}
      </IconContainer>
      <Text size={TextSizes.lg} style={{ alignSelf: 'center' }}>
        {children}
      </Text>
    </Inline>
  </Container>
);

export default Callout;
