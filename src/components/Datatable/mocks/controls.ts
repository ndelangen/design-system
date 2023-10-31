import { action } from '@storybook/addon-actions';

import { fields } from '../../Filters/mocks/options';

const filteringConfig = {
  fields,
  onApply: action('onFiltersApply'),
  onChange: action('onFiltersChange'),
  onClose: action('onFiltersClose'),
};

export const controlsConfig = {
  filteringConfig,
  searchConfig: {
    onSearch: action('onSearch'),
    onClear: action('onClear'),
  },
  onColumnVisibilityChange: action('columnVisibilityChange'),
};
