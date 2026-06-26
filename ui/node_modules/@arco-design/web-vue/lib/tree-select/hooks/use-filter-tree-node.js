"use strict";
var vue = require("vue");
var debounce = require("../../_utils/debounce.js");
var is = require("../../_utils/is.js");
function useFilterTreeNode(props) {
  const {
    searchValue,
    flattenTreeData,
    filterMethod: propFilterMethod,
    disableFilter,
    fieldNames
  } = vue.toRefs(props);
  const keyField = vue.computed(
    () => {
      var _a;
      return ((_a = fieldNames.value) == null ? void 0 : _a.key) || "key";
    }
  );
  const defaultFilterMethod = (keyword, node) => {
    const key = node[keyField.value];
    return !is.isUndefined(key) && String(key).indexOf(keyword) > -1;
  };
  const filterMethod = vue.computed(
    () => (propFilterMethod == null ? void 0 : propFilterMethod.value) || defaultFilterMethod
  );
  const filteredKeysSet = vue.ref();
  const isFiltering = vue.computed(() => !!searchValue.value);
  const isEmptyFilterResult = vue.computed(
    () => !(disableFilter == null ? void 0 : disableFilter.value) && isFiltering.value && filteredKeysSet.value && filteredKeysSet.value.size === 0
  );
  const filterTreeNode = vue.computed(
    () => (disableFilter == null ? void 0 : disableFilter.value) ? void 0 : (node) => {
      var _a, _b;
      if (!isFiltering.value)
        return true;
      const key = node[keyField.value];
      return (_b = (_a = filteredKeysSet.value) == null ? void 0 : _a.has(key || "")) != null ? _b : false;
    }
  );
  const updateFilteredKeysSet = debounce.debounce(
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
  vue.watchEffect(() => {
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
module.exports = useFilterTreeNode;
