"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
const useColumnFilter = ({
  column,
  tableCtx
}) => {
  const filterValue = vue.computed(() => {
    var _a;
    if (column.value.dataIndex && ((_a = tableCtx.filters) == null ? void 0 : _a[column.value.dataIndex])) {
      return tableCtx.filters[column.value.dataIndex];
    }
    return [];
  });
  const filterPopupVisible = vue.ref(false);
  const isFilterActive = vue.computed(() => filterValue.value.length > 0);
  const isMultipleFilter = vue.computed(
    () => {
      var _a;
      return Boolean((_a = column.value.filterable) == null ? void 0 : _a.multiple);
    }
  );
  const columnFilterValue = vue.ref(filterValue.value);
  vue.watch(filterValue, (value) => {
    if (is.isArray(value) && String(value) !== String(columnFilterValue.value)) {
      columnFilterValue.value = value;
    }
  });
  const handleFilterPopupVisibleChange = (value) => {
    filterPopupVisible.value = value;
  };
  const setFilterValue = (filterValue2) => {
    columnFilterValue.value = filterValue2;
  };
  const handleCheckboxFilterChange = (values) => {
    setFilterValue(values);
  };
  const handleRadioFilterChange = (value) => {
    setFilterValue([value]);
  };
  const handleFilterConfirm = (ev) => {
    var _a;
    if (column.value.dataIndex) {
      (_a = tableCtx.onFilterChange) == null ? void 0 : _a.call(
        tableCtx,
        column.value.dataIndex,
        columnFilterValue.value,
        ev
      );
    }
    handleFilterPopupVisibleChange(false);
  };
  const handleFilterReset = (ev) => {
    var _a;
    setFilterValue([]);
    if (column.value.dataIndex) {
      (_a = tableCtx.onFilterChange) == null ? void 0 : _a.call(
        tableCtx,
        column.value.dataIndex,
        columnFilterValue.value,
        ev
      );
    }
    handleFilterPopupVisibleChange(false);
  };
  return {
    filterPopupVisible,
    isFilterActive,
    isMultipleFilter,
    columnFilterValue,
    handleFilterPopupVisibleChange,
    setFilterValue,
    handleCheckboxFilterChange,
    handleRadioFilterChange,
    handleFilterConfirm,
    handleFilterReset
  };
};
exports.useColumnFilter = useColumnFilter;
