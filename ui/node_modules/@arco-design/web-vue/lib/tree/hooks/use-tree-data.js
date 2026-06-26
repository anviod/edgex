"use strict";
var vue = require("vue");
var index = require("../utils/index.js");
var treeData = require("../utils/tree-data.js");
function useTreeData(props) {
  const {
    treeData: propTreeData,
    fieldNames,
    selectable,
    showLine,
    blockNode,
    checkable,
    loadMore,
    draggable
  } = vue.toRefs(props);
  const treeData$1 = vue.ref([]);
  vue.watchEffect(() => {
    var _a, _b;
    treeData$1.value = treeData.generateTreeData(propTreeData.value || [], {
      selectable: (_a = selectable == null ? void 0 : selectable.value) != null ? _a : false,
      showLine: !!(showLine == null ? void 0 : showLine.value),
      blockNode: !!(blockNode == null ? void 0 : blockNode.value),
      checkable: (_b = checkable == null ? void 0 : checkable.value) != null ? _b : false,
      fieldNames: fieldNames == null ? void 0 : fieldNames.value,
      loadMore: !!(loadMore == null ? void 0 : loadMore.value),
      draggable: !!(draggable == null ? void 0 : draggable.value)
    });
  });
  const flattenTreeData = vue.computed(() => index.getFlattenTreeData(treeData$1.value));
  const key2TreeNode = vue.computed(() => index.getKey2TreeNode(flattenTreeData.value));
  return { treeData: treeData$1, flattenTreeData, key2TreeNode };
}
module.exports = useTreeData;
