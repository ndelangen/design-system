import type {
  DatatableColumnDef,
  ParsedDatatableOptions,
} from '../Datatable.types';

import { useMemo } from 'react';

import ExpandAllButton from '../buttons/ExpandAllButton';
import ExpandButton from '../buttons/ExpandButton';
import RowActionsButton from '../buttons/RowActionsButton';
import SelectButton from '../buttons/SelectButton';

export const displayColumnIds = {
  expand: 'ssc_dt_expand',
  select: 'ssc_dt_select',
  actions: 'ssc_dt_actions',
};
export const useDisplayColumns = <D,>(
  tableOptions: ParsedDatatableOptions<D>,
) => {
  return useMemo(
    () =>
      (
        [
          tableOptions.enableExpanding && {
            id: displayColumnIds.expand,
            header: '',
            headerComponent: tableOptions.enableExpandAll
              ? ExpandAllButton
              : null,
            cell: ExpandButton,
            size: 48,
            ...tableOptions.defaultDisplayColumn,
          },
          tableOptions.enableRowSelection && {
            id: displayColumnIds.select,
            header: '',
            headerComponent:
              tableOptions.enableSelectAll &&
              tableOptions.enableMultiRowSelection
                ? ({ table }) => <SelectButton table={table} isSelectAll />
                : null,
            cell: SelectButton,
            size: 37,
            ...tableOptions.defaultDisplayColumn,
          },
          tableOptions.enableRowActions && {
            id: displayColumnIds.actions,
            header: '',
            cell: ({ table, row }) => (
              <RowActionsButton row={row} table={table} />
            ),
            size: 48,
            ...tableOptions.defaultDisplayColumn,
          },
        ] as DatatableColumnDef<D>[]
      ).filter(Boolean),
    [
      tableOptions.enableExpanding,
      tableOptions.enableExpandAll,
      tableOptions.enableRowSelection,
      tableOptions.enableSelectAll,
      tableOptions.enableMultiRowSelection,
      tableOptions.defaultDisplayColumn,
      tableOptions.enableRowActions,
    ],
  );
};
