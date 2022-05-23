import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNonEmptyArray, noop } from 'ramda-adjunct';
import cls from 'classnames';

import { BannerProps } from './Banner.types';
import {
  AbsoluteLinkActionKind,
  ActionKindsPropType,
  RelativeLinkActionKind,
} from '../../types/action.types';
import * as CustomPropTypes from '../../types/customPropTypes';
import { BannerVariants } from './Banner.enums';
import { Button } from '../Button';
import { ButtonColors, ButtonVariants } from '../Button/Button.enums';
import { Inline, Padbox, Stack } from '../layout';
import { PaddingTypes } from '../layout/Padbox/Padbox.enums';
import { StretchEnum } from '../layout/Inline/Inline.enums';
import { Text as BaseText } from '../typographyLegacy';
import { TextSizes } from '../typographyLegacy/Text/Text.enums';
import { SpaceSizes } from '../../theme';
import { getColor, getLineHeight } from '../../utils';
import { ColorTypes } from '../../theme/colors.enums';
import { CloseButton } from '../CloseButton';
import { BaseToastBanner } from '../_internal/BaseToastBanner';
import { baseToastBannerColorVariants } from '../_internal/BaseToastBanner/BaseToastBanner';
import { SSCIconNames } from '../../theme/icons/icons.enums';
import { Icon } from '../Icon';
import { CLX_COMPONENT } from '../../theme/constants';

const iconPxSizesVariants = {
  [BannerVariants.info]: 16,
  [BannerVariants.warn]: 16,
  [BannerVariants.error]: 16,
  [BannerVariants.success]: 16,
};

const bgVariants = {
  [BannerVariants.info]: ColorTypes.info700,
  [BannerVariants.warn]: ColorTypes.warning500,
  [BannerVariants.error]: ColorTypes.error500,
  [BannerVariants.success]: ColorTypes.success500,
};

const StyledPadbox = styled(Padbox)<{ $variant?: BannerProps['variant'] }>`
  border-width: 1px;
  border-style: solid;
  border-color: ${({ $variant }) =>
    getColor(baseToastBannerColorVariants[$variant])};
  background-color: ${({ $variant }) => getColor(bgVariants[$variant])};
`;

const StyledButton = styled(Button)<{ $variant?: BannerProps['variant'] }>`
  height: inherit;
  padding: 0;
  line-height: ${getLineHeight('md')};
  text-decoration: underline;
  color: ${({ $variant }) =>
    getColor(
      $variant === 'info' || $variant === 'error'
        ? 'neutral.0'
        : 'neutral.1000',
    )} !important;
`;

const ContentWrapper = styled(Padbox)`
  padding-left: 0rem;
`;

/* stylelint-disable */
const Text = styled(BaseText)<{ $variant?: BannerProps['variant'] }>`
  max-width: 125ch;
  color: ${({ $variant }) =>
    getColor(
      $variant === 'info' || $variant === 'error'
        ? 'neutral.0'
        : 'neutral.1000',
    )};
  display: -webkit-box;
  overflow-y: auto;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
/* stylelint-enable */

const Banner: React.FC<BannerProps> = ({
  children,
  variant = BannerVariants.info,
  actions,
  isDismissable = true,
  onClose = noop,
  __hasPagination = false,
  __onPrev,
  __onNext,
  __isFirst,
  __isLast,
  __current,
  __total,
  className,
  ...props
}) => {
  return (
    <StyledPadbox $variant={variant} paddingSize={SpaceSizes.sm}>
      <BaseToastBanner
        className={cls(CLX_COMPONENT, className)}
        iconAlign="flex-start"
        iconPxSizesVariants={iconPxSizesVariants}
        iconSize={16}
        paddingSize={SpaceSizes.md}
        paddingType={PaddingTypes.square}
        stretch={StretchEnum.end}
        variant={variant}
        {...props}
      >
        <ContentWrapper paddingSize={SpaceSizes.md}>
          <Inline align="flex-start" gap={SpaceSizes.xl} stretch={1}>
            <Stack align="center" gap={SpaceSizes.md}>
              <Text $variant={variant} as="div" size={TextSizes.md}>
                {children}
              </Text>
              {isNonEmptyArray(actions) && (
                <Inline gap={SpaceSizes.mdPlus}>
                  {actions.map((action) => (
                    <StyledButton
                      key={action.name}
                      $variant={variant}
                      color={ButtonColors.primary}
                      href={
                        (action as AbsoluteLinkActionKind<[React.MouseEvent]>)
                          .href
                      }
                      name={action.name}
                      to={
                        (action as RelativeLinkActionKind<[React.MouseEvent]>)
                          .to
                      }
                      variant={ButtonVariants.text}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </StyledButton>
                  ))}
                </Inline>
              )}
            </Stack>
            {__hasPagination && (
              <Inline gap={SpaceSizes.sm}>
                <StyledButton
                  aria-label="Show previous banner"
                  isDisabled={__isFirst}
                  variant="text"
                  onClick={__onPrev}
                >
                  <Icon name={SSCIconNames.angleLeft} />
                </StyledButton>
                <Text as="div" size={TextSizes.md}>
                  {__current} of {__total}
                </Text>
                <StyledButton
                  aria-label="Show next banner"
                  isDisabled={__isLast}
                  variant="text"
                  onClick={__onNext}
                >
                  <Icon name={SSCIconNames.angleRight} />
                </StyledButton>
              </Inline>
            )}
            {isDismissable && (
              <CloseButton
                aria-label="Close banner"
                isInverted={variant === 'error' || variant === 'info'}
                marginCompensation={SpaceSizes.md}
                onClose={onClose}
              />
            )}
          </Inline>
        </ContentWrapper>
      </BaseToastBanner>
    </StyledPadbox>
  );
};

Banner.propTypes = {
  variant: PropTypes.oneOf(Object.values(BannerVariants)),
  actions: CustomPropTypes.tuple(ActionKindsPropType, ActionKindsPropType),
  isDismissable: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
};
Banner.displayName = 'Banner';

export default Banner;
