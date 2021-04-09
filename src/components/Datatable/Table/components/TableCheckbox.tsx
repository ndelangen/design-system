import React, { forwardRef } from 'react';
import cls from 'classnames';

import * as checked from '../../../../theme/icons/check';
import * as indeterminate from '../../../../theme/icons/minus';
import { Checkbox } from '../../../forms';
import { TableCheckboxProps } from './TableCheckbox.types';

const generateIconProps = ({ width, height, svgPathData }) => ({
  viewBox: `0 0 ${width} ${height}`,
  children: <path d={svgPathData} fill="currentColor" />,
});

const Mark = ({ children, ...props }) => (
  <svg role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
    {children}
  </svg>
);

const TableCheckbox = forwardRef(
  (
    { name, checkboxId, isIndeterminate, ...props }: TableCheckboxProps,
    ref: React.MutableRefObject<HTMLInputElement>,
  ): React.ReactElement => (
    <div className="ds-table-checkbox">
      <input
        ref={ref}
        className={cls('ds-table-checkbox-input', {
          'is-indeterminate': isIndeterminate,
        })}
        id={checkboxId}
        name={name}
        type="checkbox"
        {...props}
      />
      <div className="ds-table-checkbox-mark">
        <Mark
          className="ds-table-checkbox-icon"
          {...generateIconProps(isIndeterminate ? indeterminate : checked)}
        />
      </div>
      <label
        aria-label="Toggle select"
        className="ds-table-checkbox-label"
        htmlFor={checkboxId}
      />
    </div>
  ),
);

TableCheckbox.propTypes = Checkbox.propTypes;

export default TableCheckbox;