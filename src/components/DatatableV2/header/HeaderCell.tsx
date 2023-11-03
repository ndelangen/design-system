import React from 'react';
import { flexRender } from '@tanstack/react-table';

import HeaderCellSortButton from './HeaderCellSortButton';
import { DatatableHeader, DatatableInstance } from '../Datatable.types';
import HeaderCellColumnActionsButton from './HeaderCellColumnActionsButton';
import { getCommonCellStyles } from '../columns.utils';
import HeaderCellResizeHandler from './HeaderCellResizeHandler';

const HeaderCell = <D,>({
  header,
  table,
}: {
  header: DatatableHeader<D>;
  table: DatatableInstance<D>;
}) => {
  const {
    options: { enableColumnActions },
  } = table;
  const { column, getContext, getSize, id, isPlaceholder } = header;
  const {
    columnDef,
    getCanResize,
    getCanSort,
    getIsSorted,
    getToggleSortingHandler,
  } = column;

  const showColumnActions =
    (enableColumnActions || columnDef?.enableColumnActions) &&
    columnDef?.enableColumnActions !== false;

  return (
    <th
      key={id}
      className="ds-table-header-cell ds-table-cell"
      style={{
        ...getCommonCellStyles({
          table,
          header,
          column,
        }),
        width: getSize(),
      }}
    >
      {/* I know what I'm doing here */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <span
        className="ds-table-header-cell-label"
        onClick={getToggleSortingHandler()}
      >
        {isPlaceholder ? null : flexRender(columnDef.header, getContext())}
      </span>
      {getCanSort() && (
        <HeaderCellSortButton
          direction={getIsSorted()}
          header={header}
          table={table}
        />
      )}
      {showColumnActions && (
        <HeaderCellColumnActionsButton header={header} table={table} />
      )}
      {getCanResize() && (
        <HeaderCellResizeHandler header={header} table={table} />
      )}
    </th>
  );
};

export default HeaderCell;
