import { isBoolean } from "../../_utils/is.js";
function getFlattenTreeData(tree) {
  const flattenTreeData = [];
  function preOrder(tree2) {
    if (!tree2)
      return;
    tree2.forEach((node) => {
      flattenTreeData.push(node);
      preOrder(node.children);
    });
  }
  preOrder(tree);
  return flattenTreeData;
}
function getKey2TreeNode(flattenTreeData) {
  const key2TreeNode = /* @__PURE__ */ new Map();
  flattenTreeData.forEach((node) => {
    key2TreeNode.set(node.key, node);
  });
  return key2TreeNode;
}
function isNodeSelectable(node) {
  return node.selectable && !node.disabled;
}
function isNodeExpandable(node) {
  return !node.isLeaf && node.children;
}
function isLeafNode(node) {
  if (isBoolean(node.isLeaf))
    return node.isLeaf;
  return !node.children;
}
export { getFlattenTreeData, getKey2TreeNode, isLeafNode, isNodeExpandable, isNodeSelectable };
