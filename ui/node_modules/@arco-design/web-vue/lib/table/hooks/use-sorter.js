"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
var isEqual = require("../../_utils/is-equal.js");
const useSorter = ({
  columns,
  onSorterChange
}) => {
  const _sorter = vue.ref(getDefaultSorter(columns.value));
  vue.watch(columns, (columns2) => {
    const newSorter = getDefaultSorter(columns2);
    if (!isEqual.isEqual(newSorter, _sorter.value)) {
      _sorter.value = newSorter;
    }
  });
  const computedSorter = vue.computed(() => {
    var _a;
    for (const item of columns.value) {
      if (item.dataIndex && item.sortable) {
        const direction = is.isString(item.sortable.sortOrder) ? item.sortable.sortOrder : ((_a = _sorter.value) == null ? void 0 : _a.field) === item.dataIndex ? _sorter.value.direction : "";
        if (direction) {
          return {
            field: item.dataIndex,
            direction
          };
        }
      }
    }
    return void 0;
  });
  const resetSorters = () => {
    var _a;
    let sorter;
    for (const item of columns.value) {
      if (item.dataIndex && item.sortable) {
        if (!sorter && item.sortable.defaultSortOrder) {
          sorter = {
            field: item.dataIndex,
            direction: item.sortable.defaultSortOrder
          };
        }
        onSorterChange(item.dataIndex, (_a = item.sortable.defaultSortOrder) != null ? _a : "");
      }
    }
    _sorter.value = sorter;
  };
  const clearSorters = () => {
    for (const item of columns.value) {
      if (item.dataIndex && item.sortable) {
        onSorterChange(item.dataIndex, "");
      }
    }
  };
  return {
    _sorter,
    computedSorter,
    resetSorters,
    clearSorters
  };
};
const getDefaultSorter = (columns) => {
  var _a;
  for (const item of columns) {
    if (item.dataIndex && ((_a = item.sortable) == null ? void 0 : _a.defaultSortOrder)) {
      return {
        field: item.dataIndex,
        direction: item.sortable.defaultSortOrder
      };
    }
  }
  return void 0;
};
exports.useSorter = useSorter;
