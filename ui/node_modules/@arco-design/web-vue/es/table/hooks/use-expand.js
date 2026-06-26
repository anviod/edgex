import { ref, computed } from "vue";
const useExpand = ({
  expandedKeys,
  defaultExpandedKeys,
  defaultExpandAllRows,
  expandable,
  allRowKeys,
  emit
}) => {
  const getDefaultExpandedRowKeys = () => {
    var _a, _b;
    if (defaultExpandedKeys.value) {
      return defaultExpandedKeys.value;
    }
    if ((_a = expandable.value) == null ? void 0 : _a.defaultExpandedRowKeys) {
      return expandable.value.defaultExpandedRowKeys;
    }
    if (defaultExpandAllRows.value || ((_b = expandable.value) == null ? void 0 : _b.defaultExpandAllRows)) {
      return [...allRowKeys.value];
    }
    return [];
  };
  const _expandedRowKeys = ref(getDefaultExpandedRowKeys());
  const expandedRowKeys = computed(
    () => {
      var _a, _b, _c;
      return (_c = (_b = expandedKeys.value) != null ? _b : (_a = expandable.value) == null ? void 0 : _a.expandedRowKeys) != null ? _c : _expandedRowKeys.value;
    }
  );
  const handleExpand = (rowKey, record) => {
    const isExpanded = expandedRowKeys.value.includes(rowKey);
    const newExpandedRowKeys = isExpanded ? expandedRowKeys.value.filter((key) => rowKey !== key) : expandedRowKeys.value.concat(rowKey);
    _expandedRowKeys.value = newExpandedRowKeys;
    emit("expand", rowKey, record);
    emit("expandedChange", newExpandedRowKeys);
    emit("update:expandedKeys", newExpandedRowKeys);
  };
  const expand = (rowKey, expanded = true) => {
    const _rowKeys = [].concat(rowKey);
    const newExpandedRowKeys = expanded ? expandedRowKeys.value.concat(_rowKeys) : expandedRowKeys.value.filter((key) => !_rowKeys.includes(key));
    _expandedRowKeys.value = newExpandedRowKeys;
    emit("expandedChange", newExpandedRowKeys);
    emit("update:expandedKeys", newExpandedRowKeys);
  };
  const expandAll = (expanded = true) => {
    const newExpandedRowKeys = expanded ? [...allRowKeys.value] : [];
    _expandedRowKeys.value = newExpandedRowKeys;
    emit("expandedChange", newExpandedRowKeys);
    emit("update:expandedKeys", newExpandedRowKeys);
  };
  return {
    expandedRowKeys,
    handleExpand,
    expand,
    expandAll
  };
};
export { useExpand };
