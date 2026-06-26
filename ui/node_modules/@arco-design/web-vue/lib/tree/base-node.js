"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var useTreeContext = require("./hooks/use-tree-context.js");
var nodeSwitcher_vue_vue_type_script_lang = require("./node-switcher.vue_vue_type_script_lang.js");
var useNodeKey = require("./hooks/use-node-key.js");
var index = require("../checkbox/index.js");
var renderFunction = require("../_components/render-function.js");
var is = require("../_utils/is.js");
var useDraggable = require("./hooks/use-draggable.js");
var index$1 = require("../icon/icon-drag-dot-vertical/index.js");
var toArray = require("../_utils/to-array.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "BaseTreeNode",
  components: {
    NodeSwitcher: nodeSwitcher_vue_vue_type_script_lang,
    Checkbox: index["default"],
    RenderFunction: renderFunction,
    IconDragDotVertical: index$1
  },
  props: {
    title: {
      type: String
    },
    selectable: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    disableCheckbox: {
      type: Boolean
    },
    checkable: {
      type: Boolean
    },
    draggable: {
      type: Boolean
    },
    isLeaf: {
      type: Boolean
    },
    icon: {
      type: Function
    },
    switcherIcon: {
      type: Function
    },
    loadingIcon: {
      type: Function
    },
    dragIcon: {
      type: Function
    },
    isTail: {
      type: Boolean
    },
    blockNode: {
      type: Boolean
    },
    showLine: {
      type: Boolean
    },
    level: {
      type: Number,
      default: 0
    },
    lineless: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const key = useNodeKey();
    const prefixCls = globalConfig.getPrefixCls("tree-node");
    const treeContext = useTreeContext();
    const node = vue.computed(
      () => {
        var _a;
        return (_a = treeContext.key2TreeNode) == null ? void 0 : _a.get(key.value);
      }
    );
    const treeNodeData = vue.computed(() => node.value.treeNodeData);
    const children = vue.computed(() => node.value.children);
    const actionOnNodeClick = vue.computed(() => {
      var _a;
      const action = (_a = treeContext.treeProps) == null ? void 0 : _a.actionOnNodeClick;
      return action ? toArray.toArray(action) : [];
    });
    const { isLeaf, isTail, selectable, disabled, disableCheckbox, draggable } = vue.toRefs(props);
    const classNames = vue.computed(() => {
      var _a;
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-selected`]: selected.value,
          [`${prefixCls}-is-leaf`]: isLeaf.value,
          [`${prefixCls}-is-tail`]: isTail.value,
          [`${prefixCls}-expanded`]: expanded.value,
          [`${prefixCls}-disabled-selectable`]: !selectable.value && !((_a = treeContext.treeProps) == null ? void 0 : _a.disableSelectActionOnly),
          [`${prefixCls}-disabled`]: disabled.value
        }
      ];
    });
    const refTitle = vue.ref();
    const { isDragOver, isDragging, isAllowDrop, dropPosition, setDragStatus } = useDraggable(
      vue.reactive({
        key,
        refTitle
      })
    );
    const titleClassNames = vue.computed(() => [
      `${prefixCls}-title`,
      {
        [`${prefixCls}-title-draggable`]: draggable.value,
        [`${prefixCls}-title-gap-top`]: isDragOver.value && isAllowDrop.value && dropPosition.value < 0,
        [`${prefixCls}-title-gap-bottom`]: isDragOver.value && isAllowDrop.value && dropPosition.value > 0,
        [`${prefixCls}-title-highlight`]: !isDragging.value && isDragOver.value && isAllowDrop.value && dropPosition.value === 0,
        [`${prefixCls}-title-dragging`]: isDragging.value,
        [`${prefixCls}-title-block`]: node.value.blockNode
      }
    ]);
    const checked = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.checkedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const indeterminate = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.indeterminateKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const selected = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.selectedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const expanded = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.expandedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const loading = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.loadingKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const treeDragIcon = vue.computed(() => treeContext.dragIcon);
    const treeNodeIcon = vue.computed(() => treeContext.nodeIcon);
    function onSwitcherClick(e) {
      var _a, _b;
      if (isLeaf.value)
        return;
      if (!((_a = children.value) == null ? void 0 : _a.length) && is.isFunction(treeContext.onLoadMore)) {
        treeContext.onLoadMore(key.value);
      } else {
        (_b = treeContext == null ? void 0 : treeContext.onExpand) == null ? void 0 : _b.call(treeContext, !expanded.value, key.value, e);
      }
    }
    const nodeStatus = vue.reactive({
      loading,
      checked,
      selected,
      indeterminate,
      expanded,
      isLeaf
    });
    const treeTitle = vue.computed(
      () => treeContext.nodeTitle ? () => {
        var _a;
        return (_a = treeContext.nodeTitle) == null ? void 0 : _a.call(treeContext, treeNodeData.value, nodeStatus);
      } : void 0
    );
    const extra = vue.computed(
      () => treeContext.nodeExtra ? () => {
        var _a;
        return (_a = treeContext.nodeExtra) == null ? void 0 : _a.call(treeContext, treeNodeData.value, nodeStatus);
      } : void 0
    );
    return {
      nodekey: key,
      refTitle,
      prefixCls,
      classNames,
      titleClassNames,
      indeterminate,
      checked,
      expanded,
      selected,
      treeTitle,
      treeNodeData,
      loading,
      treeDragIcon,
      treeNodeIcon,
      extra,
      nodeStatus,
      onCheckboxChange(checked2, e) {
        var _a;
        if (disableCheckbox.value || disabled.value) {
          return;
        }
        (_a = treeContext.onCheck) == null ? void 0 : _a.call(treeContext, checked2, key.value, e);
      },
      onTitleClick(e) {
        var _a;
        if (actionOnNodeClick.value.includes("expand")) {
          onSwitcherClick(e);
        }
        if (!selectable.value || disabled.value)
          return;
        (_a = treeContext.onSelect) == null ? void 0 : _a.call(treeContext, key.value, e);
      },
      onSwitcherClick,
      onDragStart(e) {
        var _a;
        if (!draggable.value)
          return;
        e.stopPropagation();
        setDragStatus("dragStart", e);
        try {
          (_a = e.dataTransfer) == null ? void 0 : _a.setData("text/plain", "");
        } catch (error) {
        }
      },
      onDragEnd(e) {
        if (!draggable.value)
          return;
        e.stopPropagation();
        setDragStatus("dragEnd", e);
      },
      onDragOver(e) {
        if (!draggable)
          return;
        e.stopPropagation();
        e.preventDefault();
        setDragStatus("dragOver", e);
      },
      onDragLeave(e) {
        if (!draggable.value)
          return;
        e.stopPropagation();
        setDragStatus("dragLeave", e);
      },
      onDrop(e) {
        if (!draggable.value || !isAllowDrop.value)
          return;
        e.stopPropagation();
        e.preventDefault();
        setDragStatus("drop", e);
      }
    };
  }
});
const _hoisted_1 = ["data-level", "data-key"];
const _hoisted_2 = ["draggable"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_NodeSwitcher = vue.resolveComponent("NodeSwitcher");
  const _component_Checkbox = vue.resolveComponent("Checkbox");
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  const _component_IconDragDotVertical = vue.resolveComponent("IconDragDotVertical");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames),
    "data-level": _ctx.level,
    "data-key": _ctx.nodekey
  }, [
    vue.createCommentVNode(" \u7F29\u8FDB "),
    vue.createElementVNode("span", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-indent`)
    }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.level, (i) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          key: i,
          class: vue.normalizeClass([
            `${_ctx.prefixCls}-indent-block`,
            {
              [`${_ctx.prefixCls}-indent-block-lineless`]: _ctx.lineless[i - 1]
            }
          ])
        }, null, 2);
      }), 128))
    ], 2),
    vue.createCommentVNode(" switcher "),
    vue.createElementVNode("span", {
      class: vue.normalizeClass([
        `${_ctx.prefixCls}-switcher`,
        {
          [`${_ctx.prefixCls}-switcher-expanded`]: _ctx.expanded
        }
      ])
    }, [
      vue.createVNode(_component_NodeSwitcher, {
        "prefix-cls": _ctx.prefixCls,
        loading: _ctx.loading,
        "show-line": _ctx.showLine,
        "tree-node-data": _ctx.treeNodeData,
        icons: {
          switcherIcon: _ctx.switcherIcon,
          loadingIcon: _ctx.loadingIcon
        },
        "node-status": _ctx.nodeStatus,
        onClick: _ctx.onSwitcherClick
      }, vue.createSlots({ _: 2 }, [
        _ctx.$slots["switcher-icon"] ? {
          name: "switcher-icon",
          fn: vue.withCtx(() => [
            vue.createCommentVNode(" @slot \u5B9A\u5236 switcher \u56FE\u6807\uFF0C\u4F1A\u8986\u76D6 Tree \u7684\u914D\u7F6E "),
            vue.renderSlot(_ctx.$slots, "switcher-icon")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots["loading-icon"] ? {
          name: "loading-icon",
          fn: vue.withCtx(() => [
            vue.createCommentVNode(" @slot \u5B9A\u5236 loading \u56FE\u6807\uFF0C\u4F1A\u8986\u76D6 Tree \u7684\u914D\u7F6E "),
            vue.renderSlot(_ctx.$slots, "loading-icon")
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "loading", "show-line", "tree-node-data", "icons", "node-status", "onClick"])
    ], 2),
    vue.createCommentVNode(" checkbox "),
    _ctx.checkable ? (vue.openBlock(), vue.createBlock(_component_Checkbox, {
      key: 0,
      disabled: _ctx.disableCheckbox || _ctx.disabled,
      "model-value": _ctx.checked,
      indeterminate: _ctx.indeterminate,
      "uninject-group-context": "",
      onChange: _ctx.onCheckboxChange
    }, null, 8, ["disabled", "model-value", "indeterminate", "onChange"])) : vue.createCommentVNode("v-if", true),
    vue.createCommentVNode(" \u5185\u5BB9 "),
    vue.createElementVNode("span", {
      ref: "refTitle",
      class: vue.normalizeClass(_ctx.titleClassNames),
      draggable: _ctx.draggable,
      onDragstart: _cache[0] || (_cache[0] = (...args) => _ctx.onDragStart && _ctx.onDragStart(...args)),
      onDragend: _cache[1] || (_cache[1] = (...args) => _ctx.onDragEnd && _ctx.onDragEnd(...args)),
      onDragover: _cache[2] || (_cache[2] = (...args) => _ctx.onDragOver && _ctx.onDragOver(...args)),
      onDragleave: _cache[3] || (_cache[3] = (...args) => _ctx.onDragLeave && _ctx.onDragLeave(...args)),
      onDrop: _cache[4] || (_cache[4] = (...args) => _ctx.onDrop && _ctx.onDrop(...args)),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onTitleClick && _ctx.onTitleClick(...args))
    }, [
      _ctx.$slots.icon || _ctx.icon || _ctx.treeNodeIcon ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 0,
        class: vue.normalizeClass([`${_ctx.prefixCls}-icon`, `${_ctx.prefixCls}-custom-icon`])
      }, [
        vue.createCommentVNode(" \u8282\u70B9\u56FE\u6807 "),
        _ctx.$slots.icon ? vue.renderSlot(_ctx.$slots, "icon", vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.nodeStatus))) : _ctx.icon ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, vue.mergeProps({
          key: 1,
          "render-func": _ctx.icon
        }, _ctx.nodeStatus), null, 16, ["render-func"])) : _ctx.treeNodeIcon ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, vue.mergeProps({
          key: 2,
          "render-func": _ctx.treeNodeIcon,
          node: _ctx.treeNodeData
        }, _ctx.nodeStatus), null, 16, ["render-func", "node"])) : vue.createCommentVNode("v-if", true)
      ], 2)) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("span", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-title-text`)
      }, [
        _ctx.treeTitle ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.treeTitle
        }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
          vue.createCommentVNode(" \u6807\u9898\uFF0CtreeTitle \u4F18\u5148\u7EA7\u9AD8\u4E8E\u8282\u70B9\u7684 title "),
          vue.renderSlot(_ctx.$slots, "title", { title: _ctx.title }, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
          ])
        ], 2112)),
        _ctx.draggable ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 2,
          class: vue.normalizeClass([`${_ctx.prefixCls}-icon`, `${_ctx.prefixCls}-drag-icon`])
        }, [
          vue.createCommentVNode(" \u62D6\u62FD\u56FE\u6807 "),
          _ctx.$slots["drag-icon"] ? vue.renderSlot(_ctx.$slots, "drag-icon", vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.nodeStatus))) : _ctx.dragIcon ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, vue.mergeProps({
            key: 1,
            "render-func": _ctx.dragIcon
          }, _ctx.nodeStatus), null, 16, ["render-func"])) : _ctx.treeDragIcon ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, vue.mergeProps({
            key: 2,
            "render-func": _ctx.treeDragIcon,
            node: _ctx.treeNodeData
          }, _ctx.nodeStatus), null, 16, ["render-func", "node"])) : (vue.openBlock(), vue.createBlock(_component_IconDragDotVertical, { key: 3 }))
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 2)
    ], 42, _hoisted_2),
    vue.createCommentVNode(" \u989D\u5916 "),
    _ctx.extra ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
      key: 1,
      "render-func": _ctx.extra
    }, null, 8, ["render-func"])) : vue.createCommentVNode("v-if", true)
  ], 10, _hoisted_1);
}
var BaseTreeNode = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = BaseTreeNode;
