import { defineComponent, computed, toRefs, ref, reactive, resolveComponent, openBlock, createElementBlock, normalizeClass, createCommentVNode, createElementVNode, Fragment, renderList, createVNode, createSlots, withCtx, renderSlot, createBlock, normalizeProps, mergeProps, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import useTreeContext from "./hooks/use-tree-context.js";
import _sfc_main$1 from "./node-switcher.vue_vue_type_script_lang.js";
import useNodeKey from "./hooks/use-node-key.js";
import Checkbox from "../checkbox/index.js";
import RenderFunction from "../_components/render-function.js";
import { isFunction } from "../_utils/is.js";
import useDraggable from "./hooks/use-draggable.js";
import IconDragDotVertical from "../icon/icon-drag-dot-vertical/index.js";
import { toArray } from "../_utils/to-array.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "BaseTreeNode",
  components: {
    NodeSwitcher: _sfc_main$1,
    Checkbox,
    RenderFunction,
    IconDragDotVertical
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
    const prefixCls = getPrefixCls("tree-node");
    const treeContext = useTreeContext();
    const node = computed(
      () => {
        var _a;
        return (_a = treeContext.key2TreeNode) == null ? void 0 : _a.get(key.value);
      }
    );
    const treeNodeData = computed(() => node.value.treeNodeData);
    const children = computed(() => node.value.children);
    const actionOnNodeClick = computed(() => {
      var _a;
      const action = (_a = treeContext.treeProps) == null ? void 0 : _a.actionOnNodeClick;
      return action ? toArray(action) : [];
    });
    const { isLeaf, isTail, selectable, disabled, disableCheckbox, draggable } = toRefs(props);
    const classNames = computed(() => {
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
    const refTitle = ref();
    const { isDragOver, isDragging, isAllowDrop, dropPosition, setDragStatus } = useDraggable(
      reactive({
        key,
        refTitle
      })
    );
    const titleClassNames = computed(() => [
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
    const checked = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.checkedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const indeterminate = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.indeterminateKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const selected = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.selectedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const expanded = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.expandedKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const loading = computed(
      () => {
        var _a, _b;
        return (_b = (_a = treeContext.loadingKeys) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, key.value);
      }
    );
    const treeDragIcon = computed(() => treeContext.dragIcon);
    const treeNodeIcon = computed(() => treeContext.nodeIcon);
    function onSwitcherClick(e) {
      var _a, _b;
      if (isLeaf.value)
        return;
      if (!((_a = children.value) == null ? void 0 : _a.length) && isFunction(treeContext.onLoadMore)) {
        treeContext.onLoadMore(key.value);
      } else {
        (_b = treeContext == null ? void 0 : treeContext.onExpand) == null ? void 0 : _b.call(treeContext, !expanded.value, key.value, e);
      }
    }
    const nodeStatus = reactive({
      loading,
      checked,
      selected,
      indeterminate,
      expanded,
      isLeaf
    });
    const treeTitle = computed(
      () => treeContext.nodeTitle ? () => {
        var _a;
        return (_a = treeContext.nodeTitle) == null ? void 0 : _a.call(treeContext, treeNodeData.value, nodeStatus);
      } : void 0
    );
    const extra = computed(
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
  const _component_NodeSwitcher = resolveComponent("NodeSwitcher");
  const _component_Checkbox = resolveComponent("Checkbox");
  const _component_RenderFunction = resolveComponent("RenderFunction");
  const _component_IconDragDotVertical = resolveComponent("IconDragDotVertical");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames),
    "data-level": _ctx.level,
    "data-key": _ctx.nodekey
  }, [
    createCommentVNode(" \u7F29\u8FDB "),
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-indent`)
    }, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.level, (i) => {
        return openBlock(), createElementBlock("span", {
          key: i,
          class: normalizeClass([
            `${_ctx.prefixCls}-indent-block`,
            {
              [`${_ctx.prefixCls}-indent-block-lineless`]: _ctx.lineless[i - 1]
            }
          ])
        }, null, 2);
      }), 128))
    ], 2),
    createCommentVNode(" switcher "),
    createElementVNode("span", {
      class: normalizeClass([
        `${_ctx.prefixCls}-switcher`,
        {
          [`${_ctx.prefixCls}-switcher-expanded`]: _ctx.expanded
        }
      ])
    }, [
      createVNode(_component_NodeSwitcher, {
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
      }, createSlots({ _: 2 }, [
        _ctx.$slots["switcher-icon"] ? {
          name: "switcher-icon",
          fn: withCtx(() => [
            createCommentVNode(" @slot \u5B9A\u5236 switcher \u56FE\u6807\uFF0C\u4F1A\u8986\u76D6 Tree \u7684\u914D\u7F6E "),
            renderSlot(_ctx.$slots, "switcher-icon")
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots["loading-icon"] ? {
          name: "loading-icon",
          fn: withCtx(() => [
            createCommentVNode(" @slot \u5B9A\u5236 loading \u56FE\u6807\uFF0C\u4F1A\u8986\u76D6 Tree \u7684\u914D\u7F6E "),
            renderSlot(_ctx.$slots, "loading-icon")
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "loading", "show-line", "tree-node-data", "icons", "node-status", "onClick"])
    ], 2),
    createCommentVNode(" checkbox "),
    _ctx.checkable ? (openBlock(), createBlock(_component_Checkbox, {
      key: 0,
      disabled: _ctx.disableCheckbox || _ctx.disabled,
      "model-value": _ctx.checked,
      indeterminate: _ctx.indeterminate,
      "uninject-group-context": "",
      onChange: _ctx.onCheckboxChange
    }, null, 8, ["disabled", "model-value", "indeterminate", "onChange"])) : createCommentVNode("v-if", true),
    createCommentVNode(" \u5185\u5BB9 "),
    createElementVNode("span", {
      ref: "refTitle",
      class: normalizeClass(_ctx.titleClassNames),
      draggable: _ctx.draggable,
      onDragstart: _cache[0] || (_cache[0] = (...args) => _ctx.onDragStart && _ctx.onDragStart(...args)),
      onDragend: _cache[1] || (_cache[1] = (...args) => _ctx.onDragEnd && _ctx.onDragEnd(...args)),
      onDragover: _cache[2] || (_cache[2] = (...args) => _ctx.onDragOver && _ctx.onDragOver(...args)),
      onDragleave: _cache[3] || (_cache[3] = (...args) => _ctx.onDragLeave && _ctx.onDragLeave(...args)),
      onDrop: _cache[4] || (_cache[4] = (...args) => _ctx.onDrop && _ctx.onDrop(...args)),
      onClick: _cache[5] || (_cache[5] = (...args) => _ctx.onTitleClick && _ctx.onTitleClick(...args))
    }, [
      _ctx.$slots.icon || _ctx.icon || _ctx.treeNodeIcon ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: normalizeClass([`${_ctx.prefixCls}-icon`, `${_ctx.prefixCls}-custom-icon`])
      }, [
        createCommentVNode(" \u8282\u70B9\u56FE\u6807 "),
        _ctx.$slots.icon ? renderSlot(_ctx.$slots, "icon", normalizeProps(mergeProps({ key: 0 }, _ctx.nodeStatus))) : _ctx.icon ? (openBlock(), createBlock(_component_RenderFunction, mergeProps({
          key: 1,
          "render-func": _ctx.icon
        }, _ctx.nodeStatus), null, 16, ["render-func"])) : _ctx.treeNodeIcon ? (openBlock(), createBlock(_component_RenderFunction, mergeProps({
          key: 2,
          "render-func": _ctx.treeNodeIcon,
          node: _ctx.treeNodeData
        }, _ctx.nodeStatus), null, 16, ["render-func", "node"])) : createCommentVNode("v-if", true)
      ], 2)) : createCommentVNode("v-if", true),
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-title-text`)
      }, [
        _ctx.treeTitle ? (openBlock(), createBlock(_component_RenderFunction, {
          key: 0,
          "render-func": _ctx.treeTitle
        }, null, 8, ["render-func"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createCommentVNode(" \u6807\u9898\uFF0CtreeTitle \u4F18\u5148\u7EA7\u9AD8\u4E8E\u8282\u70B9\u7684 title "),
          renderSlot(_ctx.$slots, "title", { title: _ctx.title }, () => [
            createTextVNode(toDisplayString(_ctx.title), 1)
          ])
        ], 2112)),
        _ctx.draggable ? (openBlock(), createElementBlock("span", {
          key: 2,
          class: normalizeClass([`${_ctx.prefixCls}-icon`, `${_ctx.prefixCls}-drag-icon`])
        }, [
          createCommentVNode(" \u62D6\u62FD\u56FE\u6807 "),
          _ctx.$slots["drag-icon"] ? renderSlot(_ctx.$slots, "drag-icon", normalizeProps(mergeProps({ key: 0 }, _ctx.nodeStatus))) : _ctx.dragIcon ? (openBlock(), createBlock(_component_RenderFunction, mergeProps({
            key: 1,
            "render-func": _ctx.dragIcon
          }, _ctx.nodeStatus), null, 16, ["render-func"])) : _ctx.treeDragIcon ? (openBlock(), createBlock(_component_RenderFunction, mergeProps({
            key: 2,
            "render-func": _ctx.treeDragIcon,
            node: _ctx.treeNodeData
          }, _ctx.nodeStatus), null, 16, ["render-func", "node"])) : (openBlock(), createBlock(_component_IconDragDotVertical, { key: 3 }))
        ], 2)) : createCommentVNode("v-if", true)
      ], 2)
    ], 42, _hoisted_2),
    createCommentVNode(" \u989D\u5916 "),
    _ctx.extra ? (openBlock(), createBlock(_component_RenderFunction, {
      key: 1,
      "render-func": _ctx.extra
    }, null, 8, ["render-func"])) : createCommentVNode("v-if", true)
  ], 10, _hoisted_1);
}
var BaseTreeNode = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { BaseTreeNode as default };
