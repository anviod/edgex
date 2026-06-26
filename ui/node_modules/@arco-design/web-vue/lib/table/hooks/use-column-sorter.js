"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const useColumnSorter = ({
  column,
  tableCtx
}) => {
  const sortOrder = vue.computed(() => {
    var _a;
    if (column.value.dataIndex && column.value.dataIndex === ((_a = tableCtx.sorter) == null ? void 0 : _a.field)) {
      return tableCtx.sorter.direction;
    }
    return void 0;
  });
  const sortDirections = vue.computed(
    () => {
      var _a, _b, _c;
      return (_c = (_b = (_a = column.value) == null ? void 0 : _a.sortable) == null ? void 0 : _b.sortDirections) != null ? _c : [];
    }
  );
  const hasSorter = vue.computed(() => sortDirections.value.length > 0);
  const hasAscendBtn = vue.computed(() => sortDirections.value.includes("ascend"));
  const hasDescendBtn = vue.computed(
    () => sortDirections.value.includes("descend")
  );
  const nextSortOrder = vue.computed(() => {
    var _a, _b;
    if (!sortOrder.value) {
      return (_a = sortDirections.value[0]) != null ? _a : "";
    }
    if (sortOrder.value === sortDirections.value[0]) {
      return (_b = sortDirections.value[1]) != null ? _b : "";
    }
    return "";
  });
  const handleClickSorter = (ev) => {
    var _a;
    if (column.value.dataIndex) {
      (_a = tableCtx.onSorterChange) == null ? void 0 : _a.call(
        tableCtx,
        column.value.dataIndex,
        nextSortOrder.value,
        ev
      );
    }
  };
  return {
    sortOrder,
    hasSorter,
    hasAscendBtn,
    hasDescendBtn,
    nextSortOrder,
    handleClickSorter
  };
};
exports.useColumnSorter = useColumnSorter;
