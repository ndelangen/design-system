import styled from 'styled-components';
import PropTypes from 'prop-types';
import { includes } from 'ramda';
import { isNotUndefined } from 'ramda-adjunct';

import { getSpace, pxToRem } from '../../../utils';
import { SpaceSize } from '../../../theme/space.types';
import { SpaceSizes } from '../../../theme/space.enums';

export interface CenterProps {
  /**
   * Maximal content width
   */
  maxWidth?: number;
  /**
   * Gutters arround content. Gutters are not counted in maximal content width.
   */
  gutters?: SpaceSize;
  /**
   * Centers all children inside component
   */
  areChildrenCentered?: boolean;
  /**
   * Centers text in component
   */
  isTextCentered?: boolean;
}

const Center = styled.div.withConfig<CenterProps>({
  shouldForwardProp: (prop) =>
    !includes(prop, [
      'maxWidth',
      'gutters',
      'areChildrenCentered',
      'isTextCentered',
    ]),
})`
  box-sizing: content-box;
  margin-left: auto;
  margin-right: auto;
  max-width: ${({ maxWidth, theme }) =>
    pxToRem(isNotUndefined(maxWidth) ? maxWidth : theme.layout.containerWidth)};
  ${({ gutters, theme }) => {
    const size = getSpace(gutters, { theme });

    return `
      padding-left: ${size};
      padding-right: ${size};
    `;
  }};

  ${({ areChildrenCentered }) =>
    areChildrenCentered &&
    `
    display:flex;
    flex-direction: column;
    align-items: center;
  `};

  ${({ isTextCentered }) => isTextCentered && `text-align: center;`};
`;

Center.propTypes = {
  maxWidth: PropTypes.number,
  gutters: PropTypes.oneOf(Object.values(SpaceSizes)),
  areChildrenCentered: PropTypes.bool,
  isTextCentered: PropTypes.bool,
};

Center.defaultProps = {
  gutters: SpaceSizes.none,
  areChildrenCentered: false,
  isTextCentered: false,
};

export default Center;
