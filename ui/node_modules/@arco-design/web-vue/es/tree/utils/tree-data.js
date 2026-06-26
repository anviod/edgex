import { omit } from "../../_utils/omit.js";
import { isUndefined, isFunction } from "../../_utils/is.js";
const generateKey = (() => {
  let i = 0;
  return () => {
    i += 1;
    return `__arco_tree${i}`;
  };
})();
function getBoolean(val1, val2) {
  return !!(isUndefined(val1) ? val2 : val1);
}
function mapObject(obj, nameMap) {
  const _obj = { ...obj };
  if (nameMap) {
    const names = Object.keys(nameMap);
    names.forEach((name) => {
      const sourceName = nameMap[name];
      if (sourceName !== name) {
        _obj[name] = obj[sourceName];
        delete _obj[sourceName];
      }
    });
  }
  return _obj;
}
function getEnableResult({
  subEnable,
  superEnable,
  isLeaf,
  treeNodeData,
  level
}) {
  if (!isUndefined(subEnable))
    return subEnable;
  if (isFunction(superEnable)) {
    return superEnable(treeNodeData, { isLeaf, level });
  }
  return superEnable != null ? superEnable : false;
}
function generateNode(options) {
  var _a, _b;
  const { treeNodeData, parentNode, isTail = true, treeProps } = options;
  const { fieldNames } = treeProps || {};
  const mapTreeNodeData = mapObject(treeNodeData, fieldNames);
  const isLeaf = treeProps.loadMore ? !!mapTreeNodeData.isLeaf : !((_a = mapTreeNodeData.children) == null ? void 0 : _a.length);
  const level = parentNode ? parentNode.level + 1 : 0;
  const treeNodeProps = {
    ...omit(mapTreeNodeData, ["children"]),
    key: (_b = mapTreeNodeData.key) != null ? _b : generateKey(),
    selectable: getEnableResult({
      subEnable: mapTreeNodeData.selectable,
      superEnable: treeProps == null ? void 0 : treeProps.selectable,
      isLeaf,
      level,
      treeNodeData
    }),
    disabled: !!mapTreeNodeData.disabled,
    disableCheckbox: !!mapTreeNodeData.disableCheckbox,
    checkable: getEnableResult({
      subEnable: mapTreeNodeData.checkable,
      superEnable: treeProps == null ? void 0 : treeProps.checkable,
      isLeaf,
      level,
      treeNodeData
    }),
    isLeaf,
    isTail,
    blockNode: !!(treeProps == null ? void 0 : treeProps.blockNode),
    showLine: !!(treeProps == null ? void 0 : treeProps.showLine),
    level,
    lineless: parentNode ? [...parentNode.lineless, parentNode.isTail] : [],
    draggable: getBoolean(mapTreeNodeData.draggable, treeProps == null ? void 0 : treeProps.draggable)
  };
  const node = {
    ...treeNodeProps,
    treeNodeProps,
    treeNodeData,
    parent: parentNode,
    parentKey: parentNode == null ? void 0 : parentNode.key,
    pathParentKeys: parentNode ? [...parentNode.pathParentKeys, parentNode.key] : []
  };
  return node;
}
function generateTreeData(treeData, treeProps) {
  function preOrder(tree, parentNode) {
    if (!tree)
      return void 0;
    const { fieldNames } = treeProps;
    const nodes = [];
    tree.forEach((treeNodeData, index) => {
      const node = generateNode({
        treeNodeData,
        treeProps,
        parentNode,
        isTail: index === tree.length - 1
      });
      node.children = preOrder(
        treeNodeData[(fieldNames == null ? void 0 : fieldNames.children) || "children"],
        node
      );
      nodes.push(node);
    });
    return nodes;
  }
  return preOrder(treeData);
}
export { generateKey, generateTreeData };
