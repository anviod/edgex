import { toRefs, ref, watchEffect, computed } from "vue";
import { getFlattenTreeData, getKey2TreeNode } from "../utils/index.js";
import { generateTreeData } from "../utils/tree-data.js";
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
  } = toRefs(props);
  const treeData = ref([]);
  watchEffect(() => {
    var _a, _b;
    treeData.value = generateTreeData(propTreeData.value || [], {
      selectable: (_a = selectable == null ? void 0 : selectable.value) != null ? _a : false,
      showLine: !!(showLine == null ? void 0 : showLine.value),
      blockNode: !!(blockNode == null ? void 0 : blockNode.value),
      checkable: (_b = checkable == null ? void 0 : checkable.value) != null ? _b : false,
      fieldNames: fieldNames == null ? void 0 : fieldNames.value,
      loadMore: !!(loadMore == null ? void 0 : loadMore.value),
      draggable: !!(draggable == null ? void 0 : draggable.value)
    });
  });
  const flattenTreeData = computed(() => getFlattenTreeData(treeData.value));
  const key2TreeNode = computed(() => getKey2TreeNode(flattenTreeData.value));
  return { treeData, flattenTreeData, key2TreeNode };
}
export { useTreeData as default };
