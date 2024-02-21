import type { DatatableInstance, DatatableRow } from '../Datatable.types';

import clx from 'classnames';

import DetailPanel from '../panels/DetailPanel';
import BodyCell from './BodyCell';

const BodyRow = <D,>({
  row,
  table,
}: {
  row: DatatableRow<D>;
  table: DatatableInstance<D>;
}) => {
  const {
    options: { renderDetailPanel },
  } = table;
  const { getVisibleCells, getIsExpanded, getIsSelected } = row;
  return (
    <>
      <tr
        className={clx('ds-table-body-row ds-table-row', {
          'is-selected': getIsSelected(),
        })}
        style={{
          backgroundColor: getIsSelected()
            ? 'var(--sscds-table-color-selection)'
            : undefined,
        }}
      >
        {getVisibleCells().map((cell) => (
          <BodyCell key={cell.id} cell={cell} table={table} />
        ))}
      </tr>
      {renderDetailPanel && getIsExpanded() && (
        <DetailPanel row={row} table={table} />
      )}
    </>
  );
};

export default BodyRow;
