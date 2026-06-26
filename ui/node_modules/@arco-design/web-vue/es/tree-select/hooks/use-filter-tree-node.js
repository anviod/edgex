import { toRefs, computed, ref, watchEffect } from "vue";
import { debounce } from "../../_utils/debounce.js";
import { isUndefined } from "../../_utils/is.js";
function useFilterTreeNode(props) {
  const {
    searchValue,
    flattenTreeData,
    filterMethod: propFilterMethod,
    disableFilter,
    fieldNames
  } = toRefs(props);
  const keyField = computed(
    () => {
      var _a;
      return ((_a = fieldNames.value) == null ? void 0 : _a.key) || "key";
    }
  );
  const defaultFilterMethod = (keyword, node) => {
    const key = node[keyField.value];
    return !isUndefined(key) && String(key).indexOf(keyword) > -1;
  };
  const filterMethod = computed(
    () => (propFilterMethod == null ? void 0 : propFilterMethod.value) || defaultFilterMethod
  );
  const filteredKeysSet = ref();
  const isFiltering = computed(() => !!searchValue.value);
  const isEmptyFilterResult = computed(
    () => !(disableFilter == null ? void 0 : disableFilter.value) && isFiltering.value && filteredKeysSet.value && filteredKeysSet.value.size === 0
  );
  const filterTreeNode = computed(
    () => (disableFilter == null ? void 0 : disableFilter.value) ? void 0 : (node) => {
      var _a, _b;
      if (!isFiltering.value)
        return true;
      const key = node[keyField.value];
      return (_b = (_a = filteredKeysSet.value) == null ? void 0 : _a.has(key || "")) != null ? _b : false;
    }
  );
  const updateFilteredKeysSet = debounce(
    (treeData, keyword) => {
      const hitNodes = treeData.filter(
        (node) => filterMethod.value(keyword, node.treeNodeData)
      );
      const _keysSet = /* @__PURE__ */ new Set();
      hitNodes.forEach((node) => {
        _keysSet.add(node.key);
        node.pathParentKeys.forEach((_key) => {
          _keysSet.add(_key);
        });
      });
      filteredKeysSet.value = _keysSet;
    },
    100
  );
  watchEffect(() => {
    if (disableFilter == null ? void 0 : disableFilter.value) {
      filteredKeysSet.value = void 0;
    } else {
      updateFilteredKeysSet(flattenTreeData.value, searchValue.value);
    }
  });
  return {
    isEmptyFilterResult,
    filterTreeNode
  };
}
export { useFilterTreeNode as default };
