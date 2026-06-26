"use strict";
var vue = require("vue");
var treeData = require("../utils/tree-data.js");
function useNodeKey() {
  const instance = vue.getCurrentInstance();
  const getKey = () => {
    var _a;
    return (_a = instance == null ? void 0 : instance.vnode.key) != null ? _a : treeData.generateKey();
  };
  const key = vue.ref(getKey());
  vue.onUpdated(() => {
    key.value = getKey();
  });
  return key;
}
module.exports = useNodeKey;
