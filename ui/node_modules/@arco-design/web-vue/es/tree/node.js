import { defineComponent, createVNode, Fragment, mergeProps } from "vue";
import BaseTreeNode from "./base-node.js";
import useNodeKey from "./hooks/use-node-key.js";
import TransitionNodeList from "./transition-node-list.js";
var TreeNode = defineComponent({
  name: "TreeNode",
  inheritAttrs: false,
  props: {
    ...BaseTreeNode.props
  },
  setup(props, {
    slots,
    attrs
  }) {
    const key = useNodeKey();
    return () => {
      return createVNode(Fragment, null, [createVNode(BaseTreeNode, mergeProps(props, attrs, {
        "key": key.value
      }), slots), createVNode(TransitionNodeList, {
        "key": key.value,
        "nodeKey": key.value
      }, null)]);
    };
  }
});
export { TreeNode as default };
