"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var utils = require("../utils.js");
var array = require("../../_utils/array.js");
const useRowSelection = ({
  selectedKeys,
  defaultSelectedKeys,
  rowSelection,
  currentAllRowKeys,
  currentAllEnabledRowKeys,
  emit
}) => {
  var _a, _b, _c;
  const isRadio = vue.computed(() => {
    var _a2;
    return ((_a2 = rowSelection.value) == null ? void 0 : _a2.type) === "radio";
  });
  const _selectedRowKeys = vue.ref(
    (_c = (_b = defaultSelectedKeys.value) != null ? _b : (_a = rowSelection.value) == null ? void 0 : _a.defaultSelectedRowKeys) != null ? _c : []
  );
  const selectedRowKeys = vue.computed(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = (_b2 = selectedKeys.value) != null ? _b2 : (_a2 = rowSelection.value) == null ? void 0 : _a2.selectedRowKeys) != null ? _c2 : _selectedRowKeys.value;
    }
  );
  const currentSelectedRowKeys = vue.computed(
    () => selectedRowKeys.value.filter((key) => currentAllRowKeys.value.includes(key))
  );
  const handleSelectAll = (checked) => {
    const newKeys = array.union(
      selectedRowKeys.value,
      currentAllEnabledRowKeys.value,
      !checked
    );
    _selectedRowKeys.value = newKeys;
    emit("selectAll", checked);
    emit("selectionChange", newKeys);
    emit("update:selectedKeys", newKeys);
  };
  const handleSelect = (checked, record) => {
    const selectedAllRowKeys = isRadio.value ? [record.key] : array.union(selectedRowKeys.value, [record.key], !checked);
    _selectedRowKeys.value = selectedAllRowKeys;
    emit("select", selectedAllRowKeys, record.key, record.raw);
    emit("selectionChange", selectedAllRowKeys);
    emit("update:selectedKeys", selectedAllRowKeys);
  };
  const handleSelectAllLeafs = (record, checked) => {
    const newKeys = array.union(selectedRowKeys.value, utils.getLeafKeys(record), !checked);
    _selectedRowKeys.value = newKeys;
    emit("select", newKeys, record.key, record.raw);
    emit("selectionChange", newKeys);
    emit("update:selectedKeys", newKeys);
  };
  const select = (rowKey, checked = true) => {
    const _rowKeys = [].concat(rowKey);
    const newSelectedRowKeys = isRadio.value ? _rowKeys : array.union(selectedRowKeys.value, _rowKeys, !checked);
    _selectedRowKeys.value = newSelectedRowKeys;
    emit("selectionChange", newSelectedRowKeys);
    emit("update:selectedKeys", newSelectedRowKeys);
  };
  const selectAll = (checked = true) => {
    const newKeys = array.union(
      selectedRowKeys.value,
      currentAllEnabledRowKeys.value,
      !checked
    );
    _selectedRowKeys.value = newKeys;
    emit("selectionChange", newKeys);
    emit("update:selectedKeys", newKeys);
  };
  const clearSelected = () => {
    _selectedRowKeys.value = [];
    emit("selectionChange", []);
    emit("update:selectedKeys", []);
  };
  return {
    isRadio,
    selectedRowKeys,
    currentSelectedRowKeys,
    handleSelectAll,
    handleSelect,
    handleSelectAllLeafs,
    select,
    selectAll,
    clearSelected
  };
};
exports.useRowSelection = useRowSelection;
