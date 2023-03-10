import type { CSSProperties } from 'react';

export interface DropdownPaneStyles {
  $isElevated?: boolean;
}
export interface DropdownPaneProps extends DropdownPaneStyles {
  isElevated: DropdownPaneStyles['$isElevated'];
  onClickOut: () => void;
  style: CSSProperties;
}
