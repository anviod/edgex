import { defineComponent, toRefs, computed, resolveComponent, openBlock, createBlock, withCtx, createElementBlock, normalizeClass, Fragment, renderList, mergeProps, createCommentVNode } from "vue";
import ExpandTransition from "./expand-transition.js";
import { getPrefixCls } from "../_utils/global-config.js";
import useTreeContext from "./hooks/use-tree-context.js";
import BaseTreeNode from "./base-node.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TransitionNodeList",
  components: {
    ExpandTransition,
    BaseTreeNode
  },
  props: {
    nodeKey: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("tree");
    const classNames = [`${prefixCls}-node-list`];
    const treeContext = useTreeContext();
    const { nodeKey } = toRefs(props);
    const expanded = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.expandedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, nodeKey.value);
      }
    );
    const visibleNodeList = computed(() => {
      var _a;
      const expandedKeysSet = new Set(treeContext.expandedKeys || []);
      const childNodeList = (_a = treeContext.flattenTreeData) == null ? void 0 : _a.filter((node) => {
        var _a2, _b;
        if ((_a2 = node.pathParentKeys) == null ? void 0 : _a2.includes(nodeKey.value)) {
          return !treeContext.filterTreeNode || ((_b = treeContext.filterTreeNode) == null ? void 0 : _b.call(treeContext, node.treeNodeData));
        }
        return false;
      });
      return childNodeList == null ? void 0 : childNodeList.filter((node) => {
        var _a2;
        if (expanded.value) {
          return (_a2 = node.pathParentKeys) == null ? void 0 : _a2.every(
            (_key) => expandedKeysSet.has(_key)
          );
        }
        const index = node.pathParentKeys.indexOf(nodeKey.value);
        return node.pathParentKeys.slice(index + 1).every((_key) => expandedKeysSet.has(_key));
      });
    });
    const show = computed(
      () => {
        var _a, _b;
        return ((_a = treeContext.currentExpandKeys) == null ? void 0 : _a.includes(nodeKey.value)) && ((_b = visibleNodeList.value) == null ? void 0 : _b.length);
      }
    );
    return {
      classNames,
      visibleNodeList,
      show,
      expanded,
      onTransitionEnd() {
        var _a;
        (_a = treeContext.onExpandEnd) == null ? void 0 : _a.call(treeContext, nodeKey.value);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_BaseTreeNode = resolveComponent("BaseTreeNode");
  const _component_ExpandTransition = resolveComponent("ExpandTransition");
  return openBlock(), createBlock(_component_ExpandTransition, {
    expanded: _ctx.expanded,
    onEnd: _ctx.onTransitionEnd
  }, {
    default: withCtx(() => [
      _ctx.show ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(_ctx.classNames)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.visibleNodeList, (node) => {
          return openBlock(), createBlock(_component_BaseTreeNode, mergeProps({
            key: node.key,
            ref_for: true
          }, node.treeNodeProps), null, 16);
        }), 128))
      ], 2)) : createCommentVNode("v-if", true)
    ]),
    _: 1
  }, 8, ["expanded", "onEnd"]);
}
var TransitionNodeList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TransitionNodeList as default };
