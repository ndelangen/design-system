import { To } from 'history';
import { Column, IdType } from 'react-table';

import { FiltersProps } from '../Filters/Filters.types';
import {
  OnDataFetchFn,
  PrimaryKey,
  RowAction,
  TableConfig,
} from './Table/Table.types';
import { Action } from './types/Action.types';

export type CustomColumnProps<D> = {
  nullCondition?: (value: unknown) => boolean;
  nullConditionValue?: string;
  onClick?: (value: unknown, rowData: D) => void;
  hrefComposer?: (value: unknown, rowData: D) => string;
  toComposer?: (value: unknown, rowData: D) => To;
  displayLimit?: number;
};

type EnabledFilteringControls = {
  hasFiltering: true;
  filtersConfig: Omit<FiltersProps, 'isLoading'>;
};
type DisabledFilteringControls = {
  hasFiltering: false;
  filtersConfig?: never;
};

type FilteringControls = { defaultIsFilteringOpen?: boolean } & (
  | EnabledFilteringControls
  | DisabledFilteringControls
);
export type ControlsConfig<D> = {
  isControlsEnabled?: boolean;
  // Search section
  hasSearch?: boolean;

  // == Currently not implemented ==
  // Column Visibility section
  hasColumnVisibility?: boolean;
  defaultHiddenColumns?: IdType<D>[];
  // Column Ordering section
  hasColumnOrdering?: boolean;
  defaultColumnOrder?: IdType<D>[];
} & FilteringControls;

export type ExtendedTableConfig<D> = TableConfig<D> & {
  rowActions?: RowAction<D>[];
};

export interface DatatableProps<D extends Record<string, unknown>> {
  data: D[];
  totalDataSize: number;
  dataPrimaryKey?: PrimaryKey<D>;
  onDataFetch?: OnDataFetchFn<D>;
  isDataLoading?: boolean;
  columns: Column<D>[];
  tableConfig?: ExtendedTableConfig<D>;
  controlsConfig?: ControlsConfig<D>;
  batchActions?: Action[];
}