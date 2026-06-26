"use strict";
var vue = require("vue");
var baseNode = require("./base-node.js");
var useNodeKey = require("./hooks/use-node-key.js");
var transitionNodeList = require("./transition-node-list.js");
var TreeNode = vue.defineComponent({
  name: "TreeNode",
  inheritAttrs: false,
  props: {
    ...baseNode.props
  },
  setup(props, {
    slots,
    attrs
  }) {
    const key = useNodeKey();
    return () => {
      return vue.createVNode(vue.Fragment, null, [vue.createVNode(baseNode, vue.mergeProps(props, attrs, {
        "key": key.value
      }), slots), vue.createVNode(transitionNodeList, {
        "key": key.value,
        "nodeKey": key.value
      }, null)]);
    };
  }
});
module.exports = TreeNode;
