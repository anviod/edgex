import { ref, watch, computed } from "vue";
import { isEqual } from "../../_utils/is-equal.js";
const useFilter = ({
  columns,
  onFilterChange
}) => {
  const _filters = ref(getDefaultFilters(columns.value));
  watch(columns, (columns2) => {
    const newFilters = getDefaultFilters(columns2);
    if (!isEqual(newFilters, _filters.value)) {
      _filters.value = newFilters;
    }
  });
  const computedFilters = computed(() => {
    var _a, _b;
    const filters = {};
    for (const item of columns.value) {
      if (item.dataIndex) {
        const value = (_b = (_a = item.filterable) == null ? void 0 : _a.filteredValue) != null ? _b : _filters.value[item.dataIndex];
        if (value) {
          filters[item.dataIndex] = value;
        }
      }
    }
    return filters;
  });
  const resetFilters = (dataIndex) => {
    var _a;
    const _dataIndex = dataIndex ? [].concat(dataIndex) : [];
    const filters = {};
    for (const item of columns.value) {
      if (item.dataIndex && item.filterable) {
        if (_dataIndex.length === 0 || _dataIndex.includes(item.dataIndex)) {
          const filteredValue = (_a = item.filterable.defaultFilteredValue) != null ? _a : [];
          filters[item.dataIndex] = filteredValue;
          onFilterChange(item.dataIndex, filteredValue);
        }
      }
    }
    _filters.value = filters;
  };
  const clearFilters = (dataIndex) => {
    const _dataIndex = dataIndex ? [].concat(dataIndex) : [];
    const filters = {};
    for (const item of columns.value) {
      if (item.dataIndex && item.filterable) {
        if (_dataIndex.length === 0 || _dataIndex.includes(item.dataIndex)) {
          const filteredValue = [];
          filters[item.dataIndex] = filteredValue;
          onFilterChange(item.dataIndex, filteredValue);
        }
      }
    }
    _filters.value = filters;
  };
  return {
    _filters,
    computedFilters,
    resetFilters,
    clearFilters
  };
};
const getDefaultFilters = (columns) => {
  var _a;
  const filters = {};
  for (const item of columns) {
    if (item.dataIndex && ((_a = item.filterable) == null ? void 0 : _a.defaultFilteredValue)) {
      filters[item.dataIndex] = item.filterable.defaultFilteredValue;
    }
  }
  return filters;
};
export { useFilter };
