"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
function SetAdd(set) {
  return Set.prototype.add.bind(set);
}
function SetDelete(set) {
  return Set.prototype.delete.bind(set);
}
function isNodeCheckable(node) {
  if (node.disabled || node.disableCheckbox)
    return false;
  return !!node.checkable;
}
function getChildrenKeys(node) {
  var _a;
  const keys = [];
  (_a = node.children) == null ? void 0 : _a.forEach((child) => {
    if (isNodeCheckable(child)) {
      keys.push(child.key, ...getChildrenKeys(child));
    }
  });
  return keys;
}
function updateParent(options) {
  var _a;
  const { node, checkedKeySet, indeterminateKeySet } = options;
  let parentNode = node.parent;
  while (parentNode) {
    if (isNodeCheckable(parentNode)) {
      const parentKey = parentNode.key;
      const children = ((_a = parentNode.children) == null ? void 0 : _a.filter(isNodeCheckable)) || [];
      let checkedCount = 0;
      const total = children.length;
      children.some(({ key: childKey }) => {
        if (checkedKeySet.has(childKey)) {
          checkedCount += 1;
        } else if (indeterminateKeySet.has(childKey)) {
          checkedCount += 0.5;
          return true;
        }
        return false;
      });
      if (checkedCount && checkedCount !== total) {
        indeterminateKeySet.add(parentKey);
      } else {
        indeterminateKeySet.delete(parentKey);
      }
      if (checkedCount && checkedCount === total) {
        checkedKeySet.add(parentKey);
      } else {
        checkedKeySet.delete(parentKey);
      }
    }
    parentNode = parentNode.parent;
  }
}
function getCheckedStateByCheck(options) {
  const {
    node,
    checked,
    checkedKeys,
    indeterminateKeys,
    checkStrictly = false
  } = options;
  const { key } = node;
  const checkedKeySet = new Set(checkedKeys);
  const indeterminateKeySet = new Set(indeterminateKeys);
  checked ? checkedKeySet.add(key) : checkedKeySet.delete(key);
  indeterminateKeySet.delete(key);
  if (!checkStrictly) {
    const childKeys = getChildrenKeys(node);
    if (checked) {
      childKeys.forEach(SetAdd(checkedKeySet));
    } else {
      childKeys.forEach(SetDelete(checkedKeySet));
    }
    childKeys.forEach(SetDelete(indeterminateKeySet));
    updateParent({ node, checkedKeySet, indeterminateKeySet });
  }
  return [[...checkedKeySet], [...indeterminateKeySet]];
}
function getCheckedStateByInitKeys(options) {
  const { initCheckedKeys, key2TreeNode, checkStrictly, onlyCheckLeaf } = options;
  const checkedKeySet = /* @__PURE__ */ new Set();
  const childCheckedKeySet = /* @__PURE__ */ new Set();
  const indeterminateKeySet = /* @__PURE__ */ new Set();
  if (!checkStrictly) {
    initCheckedKeys.forEach((key) => {
      var _a;
      const node = key2TreeNode.get(key);
      if (!node || childCheckedKeySet.has(key) || onlyCheckLeaf && ((_a = node.children) == null ? void 0 : _a.length)) {
        return;
      }
      const childKeys = getChildrenKeys(node);
      childKeys.forEach(SetAdd(childCheckedKeySet));
      childKeys.forEach(SetDelete(indeterminateKeySet));
      checkedKeySet.add(key);
      indeterminateKeySet.delete(key);
      updateParent({ node, checkedKeySet, indeterminateKeySet });
    });
  } else {
    initCheckedKeys.forEach(SetAdd(checkedKeySet));
  }
  return [[...checkedKeySet, ...childCheckedKeySet], [...indeterminateKeySet]];
}
exports.getCheckedStateByCheck = getCheckedStateByCheck;
exports.getCheckedStateByInitKeys = getCheckedStateByInitKeys;
exports.isNodeCheckable = isNodeCheckable;
