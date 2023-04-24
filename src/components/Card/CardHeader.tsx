import type { CardHeaderProps } from './Card.types';

import styled, { css } from 'styled-components';
import { any } from 'ramda';
import { isNotNil, isNotUndefined } from 'ramda-adjunct';
import { forwardRef } from 'react';

import { SSCIconNames } from '../../theme/icons/icons.enums';
import { SpaceSizes } from '../../theme';
import { getColor, getRadii, getSpace } from '../../utils';
import { DropdownMenu } from '../_internal/BaseDropdownMenu';
import { Inline, Padbox, Stack } from '../layout';
import { Heading, Text } from '../typographyLegacy';
import { Icon } from '../Icon';
import { CardContainer } from './Card';
import { Tooltip } from '../Tooltip';

export const CardIconButton = styled.button<{
  as?: string;
  $isActive?: boolean;
}>`
  background-color: ${({ $isActive }) =>
    $isActive ? getColor('primary.50') : 'transparent'};
  border: none;
  box-sizing: content-box;
  color: ${getColor('neutral.800')};
  display: flex;
  border-radius: ${getRadii('default')};
  padding: ${getSpace(SpaceSizes.sm)};
  ${(props) =>
    props.as !== 'div' &&
    css`
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background-color: ${getColor('primary.50')};
      }

      &:focus {
        outline: none;
      }
    `}
`;
export const CardIconWrapper = styled(Padbox)`
  display: flex;
`;

const LineTruncation = css<{ numberOfLines: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.numberOfLines || 'unset'};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
/* stylelint-enable */

const TitleArea = styled.div`
  padding-top: ${getSpace(SpaceSizes.xs)};
`;
const Title = styled(Heading).attrs({
  size: 'h5',
})`
  margin-top: 0;
  margin-bottom: 0;
  ${LineTruncation}
`;

const Subtitle = styled(Text).attrs({
  size: 'md',
  variant: 'secondary',
})`
  ${LineTruncation}
`;
const ButtonsArea = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: calc(${getSpace(SpaceSizes.sm)} * -1) !important;
`;
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      actions,
      actionsButtonLabel = 'Actions menu',
      title,
      subtitle,
      leftAdornment,
      onHelpClick,
      helpTooltip,
      maxTitleLinesCount,
      maxSubtitleLinesCount,
    },
    ref,
  ) => {
    const hasHelp = any(isNotUndefined, [onHelpClick, helpTooltip]);

    return (
      <CardContainer
        horizontalPadding={SpaceSizes.mdPlus}
        verticalPadding={SpaceSizes.md}
      >
        <Inline ref={ref} gap={SpaceSizes.sm} stretch={leftAdornment ? 2 : 1}>
          {isNotNil(leftAdornment) && <div>{leftAdornment}</div>}
          <TitleArea>
            <Stack gap={SpaceSizes.xs}>
              <Title
                numberOfLines={maxTitleLinesCount}
                title={isNotUndefined(maxTitleLinesCount) ? title : undefined}
              >
                {title}
              </Title>
              <Subtitle
                numberOfLines={maxSubtitleLinesCount}
                title={
                  isNotUndefined(maxSubtitleLinesCount) ? subtitle : undefined
                }
              >
                {subtitle}
              </Subtitle>
            </Stack>
          </TitleArea>
          <ButtonsArea>
            {hasHelp && (
              <Tooltip popup={helpTooltip}>
                <CardIconButton
                  aria-label="Help"
                  as={isNotUndefined(onHelpClick) ? 'button' : 'div'}
                  data-interactive="true"
                  onClick={onHelpClick}
                >
                  <Icon
                    color="neutral.800"
                    data-interactive="true"
                    name="question-circle"
                  />
                </CardIconButton>
              </Tooltip>
            )}
            {isNotUndefined(actions) && (
              <DropdownMenu actions={actions} placement="bottom-end">
                {(isActive) => (
                  <CardIconButton
                    $isActive={isActive}
                    aria-label={actionsButtonLabel}
                    data-interactive="true"
                    title={actionsButtonLabel}
                  >
                    <Icon
                      data-interactive="true"
                      name={SSCIconNames.ellipsisV}
                      rotation={90}
                      style={{ width: '1em' }}
                    />
                  </CardIconButton>
                )}
              </DropdownMenu>
            )}
          </ButtonsArea>
        </Inline>
      </CardContainer>
    );
  },
);

export default CardHeader;
