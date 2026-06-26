"use strict";
var vue = require("vue");
var expandTransition = require("./expand-transition.js");
var globalConfig = require("../_utils/global-config.js");
var useTreeContext = require("./hooks/use-tree-context.js");
var baseNode = require("./base-node.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TransitionNodeList",
  components: {
    ExpandTransition: expandTransition,
    BaseTreeNode: baseNode
  },
  props: {
    nodeKey: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("tree");
    const classNames = [`${prefixCls}-node-list`];
    const treeContext = useTreeContext();
    const { nodeKey } = vue.toRefs(props);
    const expanded = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.expandedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, nodeKey.value);
      }
    );
    const visibleNodeList = vue.computed(() => {
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
    const show = vue.computed(
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
  const _component_BaseTreeNode = vue.resolveComponent("BaseTreeNode");
  const _component_ExpandTransition = vue.resolveComponent("ExpandTransition");
  return vue.openBlock(), vue.createBlock(_component_ExpandTransition, {
    expanded: _ctx.expanded,
    onEnd: _ctx.onTransitionEnd
  }, {
    default: vue.withCtx(() => [
      _ctx.show ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.classNames)
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.visibleNodeList, (node) => {
          return vue.openBlock(), vue.createBlock(_component_BaseTreeNode, vue.mergeProps({
            key: node.key,
            ref_for: true
          }, node.treeNodeProps), null, 16);
        }), 128))
      ], 2)) : vue.createCommentVNode("v-if", true)
    ]),
    _: 1
  }, 8, ["expanded", "onEnd"]);
}
var TransitionNodeList = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TransitionNodeList;
