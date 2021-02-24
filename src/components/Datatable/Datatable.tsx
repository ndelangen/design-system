import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { allPass, any, mergeRight, propEq } from 'ramda';
import {
  isFunction,
  isNonEmptyArray,
  isNotUndefined,
  lengthGt,
  noop,
} from 'ramda-adjunct';

import { getBorderRadius, getColor } from '../../utils/helpers';
import { Filter } from '../Filters/Filters.types';
import { FlexContainer } from '../FlexContainer';
import { ActionPropType } from './types/Action.types';
import Table from './Table/Table';
import DatatableContext from './DatatableContext';
import {
  ControlsConfig,
  DatatableProps,
  ExtendedTableConfig,
} from './Datatable.types';
import { ControlModule } from './ControlModule';
import { BatchModule } from './BatchModule';

const StyledDatatable = styled(FlexContainer)`
  border: 1px solid ${getColor('graphiteH')};
  border-radius: ${getBorderRadius};
  background: ${getColor('graphite3H')};
`;

const isCallbackDefined = allPass([isNotUndefined, isFunction]);

const defaultTableConfig: Partial<ExtendedTableConfig<
  Record<string, unknown>
>> = {
  hasSelection: true,
  onSelect: noop,
  hasPagination: true,
  hasServerSidePagination: true,
  defaultPageSize: 50,
  hasSorting: true,
  hasServerSideSorting: true,
  defaultSortBy: [],
  rowActions: [],
};

const defaultControlsConfig: ControlsConfig<Record<string, unknown>> = {
  isControlsEnabled: true,
  hasSearch: true,
  searchConfig: {
    hasSuggestions: false,
    placeholder: 'Search',
    onSearch: noop,
  },
  hasColumnVisibility: false,
  hasColumnOrdering: false,
  hasFiltering: true,
  filtersConfig: {
    onChange: noop,
    onApply: noop,
    onClose: noop,
    onCancel: noop,
    state: [],
    fields: [],
  },
  defaultIsFilteringOpen: false,
  hasGrouping: false,
  hasCustomViews: false,
};

const Datatable = <D extends Record<string, unknown>>({
  data,
  totalDataSize,
  dataPrimaryKey,
  onDataFetch = noop,
  isDataLoading,
  columns,
  tableConfig = {},
  controlsConfig = {},
  batchActions = [],
  ...props
}: DatatableProps<D>): React.ReactElement => {
  const {
    defaultPageSize,
    rowActions,
    hasSelection,
    onSelect: onRowsSelect,
    ...restTableConfig
  }: ExtendedTableConfig<D> = mergeRight(defaultTableConfig, tableConfig);

  const {
    isControlsEnabled,
    defaultHiddenColumns,
    defaultColumnOrder,
    hasFiltering,
    filtersConfig,
    searchConfig,
    ...restControlsConfig
  }: ControlsConfig<D> = mergeRight(defaultControlsConfig, controlsConfig);

  const { state: filtersState = [], onApply: onFiltersApply } = filtersConfig;
  // const { onSearch: onSearchApply } = searchConfig;
  const [searchQuery, setSearchQuery] = useState('');
  const [pageCount, setPageCount] = useState<number>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hasExclusionLogic, setHasExclusionLogic] = useState<boolean>(false);
  const [hasAppliedFilters, setHasAppliedFilters] = useState<boolean>(
    any(propEq('isApplied', true), filtersState),
  );
  const [appliedFilters, setAppliedFilters] = useState(filtersState);

  const isFilteringEnabled =
    isNonEmptyArray(filtersConfig.fields) && hasFiltering;

  useEffect(() => {
    setPageCount(Math.ceil(totalDataSize / defaultPageSize));
  }, [totalDataSize, defaultPageSize]);

  const handleOnDataFetch = useCallback(
    (pageIndex, pageSize, sortBy) => {
      onDataFetch({
        pageIndex,
        pageSize,
        sortBy,
        filters: appliedFilters,
        query: searchQuery,
      });
    },
    [appliedFilters, searchQuery, onDataFetch],
  );

  const handleOnSearch = useCallback(
    (queryValue: string) => {
      setSearchQuery(queryValue);
      console.log(`fetching data for ${queryValue} in Datatable`);
      // if (isCallbackDefined(onSearchApply)) {
      //   onSearchApply(queryValue);
      // }
      onDataFetch({
        pageSize: defaultPageSize,
        pageIndex: 0,
        query: searchQuery,
      });
    },
    [defaultPageSize, onDataFetch, searchQuery],
  );

  const handleOnFiltersAppply = useCallback(
    (filters: Filter[]) => {
      setHasAppliedFilters(lengthGt(0, filters));
      setAppliedFilters(filters);

      if (isCallbackDefined(onFiltersApply)) {
        onFiltersApply(filters);
      }
      onDataFetch({ pageSize: defaultPageSize, pageIndex: 0, filters });
    },
    [defaultPageSize, onDataFetch, onFiltersApply],
  );

  const handleOnRowsSelect = useCallback(
    (ids, exclude) => {
      setSelectedIds(ids);

      if (isCallbackDefined(onRowsSelect)) {
        onRowsSelect(ids, exclude);
      }
    },
    [onRowsSelect],
  );

  return (
    <DatatableContext.Provider
      value={{
        totalLength: totalDataSize,
        selectedIds,
        selectedLength: selectedIds.length,
        defaultHiddenColumns,
        defaultColumnOrder,
        hasExclusionLogic,
        setHasExclusionLogic,
        hasSelection,
      }}
    >
      <StyledDatatable flexDirection="column" {...props}>
        {isControlsEnabled && (
          <ControlModule<D>
            defaultColumnOrder={defaultColumnOrder}
            defaultHiddenColumns={defaultHiddenColumns}
            filtersConfig={{
              ...filtersConfig,
              onApply: handleOnFiltersAppply,
            }}
            hasFiltering={isFilteringEnabled}
            searchConfig={{
              ...searchConfig,
              onSearch: handleOnSearch,
            }}
            {...restControlsConfig}
          />
        )}
        <BatchModule actions={batchActions} />
        <Table<D>
          columns={columns}
          config={{
            hasSelection,
            onSelect: handleOnRowsSelect,
            defaultPageSize,
            ...restTableConfig,
          }}
          data={data}
          fetchData={handleOnDataFetch}
          hasAppliedFilters={hasAppliedFilters}
          isLoading={isDataLoading}
          pageCount={pageCount}
          primaryKey={dataPrimaryKey}
          rowActions={rowActions}
        />
      </StyledDatatable>
    </DatatableContext.Provider>
  );
};

Datatable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  totalDataSize: PropTypes.number.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
      id: PropTypes.string,
      width: PropTypes.number,
      Header: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      Cell: PropTypes.func,
      nullCondition: PropTypes.func,
      nullConditionValue: PropTypes.string,
      onClick: PropTypes.func,
      hrefComposer: PropTypes.func,
      toComposer: PropTypes.func,
      displayLimit: PropTypes.number,
    }),
  ).isRequired,
  dataPrimaryKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  isDataLoading: PropTypes.bool,
  tableColumns: PropTypes.shape({
    hasSelection: PropTypes.bool,
    onSelect: PropTypes.func,
    hasPagination: PropTypes.bool,
    hasServerSidePagination: PropTypes.bool,
    defaultPageSize: PropTypes.number,
    hasSorting: PropTypes.bool,
    hasServerSideSorting: PropTypes.bool,
    defaultSortBy: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        desc: PropTypes.bool,
      }),
    ),
  }),
  controlsConfig: PropTypes.shape({
    isControlsEnabled: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnVisibility: PropTypes.bool,
    defaultHiddenColumns: PropTypes.arrayOf(PropTypes.string),
    hasColumnOrdering: PropTypes.bool,
    defaultColumnOrder: PropTypes.arrayOf(PropTypes.string),
  }),
  batchActions: PropTypes.arrayOf(ActionPropType),
  onDataFetch: PropTypes.func,
};

export default Datatable;
