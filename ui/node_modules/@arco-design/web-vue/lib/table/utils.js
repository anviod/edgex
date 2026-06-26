"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("../_utils/is.js");
require("vue");
const getDataColumnsNumber = (columns) => {
  let count = 0;
  const travelColumns = (columns2) => {
    if (is.isArray(columns2) && columns2.length > 0) {
      for (const item of columns2) {
        if (!item.children) {
          count += 1;
        } else {
          travelColumns(item.children);
        }
      }
    }
  };
  travelColumns(columns);
  return count;
};
const getTotalHeaderRows = (columns) => {
  let count = 0;
  if (is.isArray(columns) && columns.length > 0) {
    count = 1;
    for (const item of columns) {
      if (item.children) {
        const depth = getTotalHeaderRows(item.children);
        if (depth > 0) {
          count = Math.max(count, depth + 1);
        }
      }
    }
  }
  return count;
};
const setParentFixed = (column, fixed) => {
  let { parent } = column;
  while (parent) {
    if (parent.fixed === fixed) {
      if (fixed === "left") {
        parent.isLastLeftFixed = true;
      } else {
        parent.isFirstRightFixed = true;
      }
    }
    parent = parent.parent;
  }
};
const getGroupColumns = (columns, columnMap, columnWidth) => {
  const totalHeaderRows = getTotalHeaderRows(columns);
  columnMap.clear();
  const dataColumns = [];
  const groupColumns = [...Array(totalHeaderRows)].map(
    () => []
  );
  let lastLeftFixedIndex;
  let firstRightFixedIndex;
  const travelColumns = (columns2, {
    level = 0,
    parent,
    fixed
  } = {}) => {
    var _a;
    for (const item of columns2) {
      const cell = { ...item, parent };
      if (is.isArray(cell.children)) {
        const colSpan = getDataColumnsNumber(cell.children);
        if (colSpan > 1) {
          cell.colSpan = colSpan;
        }
        groupColumns[level].push(cell);
        travelColumns(cell.children, {
          level: level + 1,
          parent: cell,
          fixed: cell.fixed
        });
      } else {
        const rowSpan = totalHeaderRows - level;
        if (rowSpan > 1) {
          cell.rowSpan = rowSpan;
        }
        if (fixed || cell.fixed) {
          cell.fixed = (_a = cell.fixed) != null ? _a : fixed;
          if (cell.fixed === "left") {
            lastLeftFixedIndex = dataColumns.length;
          } else if (is.isUndefined(firstRightFixedIndex)) {
            firstRightFixedIndex = dataColumns.length;
          }
        }
        if (is.isUndefined(cell.dataIndex) || is.isNull(cell.dataIndex)) {
          cell.dataIndex = `__arco_data_index_${dataColumns.length}`;
        }
        if (columnWidth[cell.dataIndex]) {
          cell._resizeWidth = columnWidth[cell.dataIndex];
        }
        columnMap.set(cell.dataIndex, cell);
        dataColumns.push(cell);
        groupColumns[level].push(cell);
      }
    }
  };
  travelColumns(columns);
  if (!is.isUndefined(lastLeftFixedIndex)) {
    dataColumns[lastLeftFixedIndex].isLastLeftFixed = true;
    setParentFixed(dataColumns[lastLeftFixedIndex], "left");
  }
  if (!is.isUndefined(firstRightFixedIndex)) {
    dataColumns[firstRightFixedIndex].isFirstRightFixed = true;
    setParentFixed(dataColumns[firstRightFixedIndex], "right");
  }
  return { dataColumns, groupColumns };
};
const getOperationColumnIndex = (operations, name) => {
  for (let i = 0; i < operations.length; i++) {
    if (operations[i].name === name) {
      return i;
    }
  }
  return -1;
};
const getOperationFixedNumber = (column, operations) => {
  var _a;
  const index = getOperationColumnIndex(operations, column.name);
  if (index <= 0) {
    return 0;
  }
  let count = 0;
  const _operations = operations.slice(0, index);
  for (const item of _operations) {
    count += (_a = item.width) != null ? _a : 0;
  }
  return count;
};
const getFirstDataColumn = (column) => {
  if (column.children && column.children.length > 0)
    return getFirstDataColumn(column.children[0]);
  return column;
};
const getLastDataColumn = (column) => {
  if (column.children && column.children.length > 0)
    return getFirstDataColumn(column.children[column.children.length - 1]);
  return column;
};
const getFixedNumber = (column, {
  dataColumns,
  operations
}) => {
  var _a, _b, _c;
  let count = 0;
  if (column.fixed === "left") {
    for (const item of operations) {
      count += (_a = item.width) != null ? _a : 40;
    }
    const first = getFirstDataColumn(column);
    for (const item of dataColumns) {
      if (first.dataIndex === item.dataIndex) {
        break;
      }
      count += (_c = (_b = item._resizeWidth) != null ? _b : item.width) != null ? _c : 0;
    }
    return count;
  }
  const last = getLastDataColumn(column);
  for (let i = dataColumns.length - 1; i > 0; i--) {
    const item = dataColumns[i];
    if (last.dataIndex === item.dataIndex) {
      break;
    }
    if (item.fixed === "right") {
      count += item.width;
    }
  }
  return count;
};
const getOperationFixedCls = (prefixCls, column) => {
  if (column.fixed) {
    return [
      `${prefixCls}-col-fixed-left`,
      {
        [`${prefixCls}-col-fixed-left-last`]: column.isLastLeftFixed
      }
    ];
  }
  return [];
};
const getFixedCls = (prefixCls, column) => {
  if (column.fixed === "left") {
    return [
      `${prefixCls}-col-fixed-left`,
      {
        [`${prefixCls}-col-fixed-left-last`]: column.isLastLeftFixed
      }
    ];
  }
  if (column.fixed === "right") {
    return [
      `${prefixCls}-col-fixed-right`,
      {
        [`${prefixCls}-col-fixed-right-first`]: column.isFirstRightFixed
      }
    ];
  }
  return [];
};
const getStyle = (column, {
  dataColumns,
  operations
}) => {
  if (column.fixed) {
    const offset = `${getFixedNumber(column, { dataColumns, operations })}px`;
    if (column.fixed === "left") {
      return {
        left: offset
      };
    }
    return {
      right: offset
    };
  }
  return {};
};
const getOperationStyle = (column, operations) => {
  if (column.fixed) {
    return {
      left: `${getOperationFixedNumber(column, operations)}px`
    };
  }
  return {};
};
function mapArrayWithChildren(arr) {
  return arr.map((item) => {
    const newItem = { ...item };
    if (newItem.children) {
      newItem.children = mapArrayWithChildren(newItem.children);
    }
    return newItem;
  });
}
function mapRawTableData(arr) {
  return arr.map((item) => {
    const rawItem = item.raw;
    if (item.children && rawItem.children) {
      rawItem.children = mapRawTableData(item.children);
    }
    return item.raw;
  });
}
const getLeafKeys = (record) => {
  const keys = [];
  if (record.children) {
    for (const item of record.children) {
      if (item.isLeaf) {
        keys.push(item.key);
      } else {
        keys.push(...getLeafKeys(item));
      }
    }
  }
  return keys;
};
const getSelectionStatus = (selectedRowKeys, leafKeys) => {
  let checked = false;
  let indeterminate = false;
  const selectedLeafKeys = leafKeys.filter(
    (key) => selectedRowKeys.includes(key)
  );
  if (selectedLeafKeys.length > 0) {
    if (selectedLeafKeys.length >= leafKeys.length) {
      checked = true;
    } else {
      indeterminate = true;
    }
  }
  return {
    checked,
    indeterminate
  };
};
exports.getFixedCls = getFixedCls;
exports.getFixedNumber = getFixedNumber;
exports.getGroupColumns = getGroupColumns;
exports.getLeafKeys = getLeafKeys;
exports.getOperationFixedCls = getOperationFixedCls;
exports.getOperationFixedNumber = getOperationFixedNumber;
exports.getOperationStyle = getOperationStyle;
exports.getSelectionStatus = getSelectionStatus;
exports.getStyle = getStyle;
exports.mapArrayWithChildren = mapArrayWithChildren;
exports.mapRawTableData = mapRawTableData;
