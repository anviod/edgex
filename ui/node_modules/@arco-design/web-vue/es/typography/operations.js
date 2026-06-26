import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, Fragment, createBlock, mergeProps, withCtx, createElementVNode, normalizeClass, withModifiers, createVNode, createCommentVNode, normalizeProps, renderSlot, createTextVNode, toDisplayString } from "vue";
import Tooltip from "../tooltip/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconCopy from "../icon/icon-copy/index.js";
import IconEdit from "../icon/icon-edit/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useI18n } from "../locale/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TypographyOperations",
  components: {
    Tooltip,
    IconCheckCircleFill,
    IconCopy,
    IconEdit
  },
  props: {
    editable: Boolean,
    copyable: Boolean,
    expandable: Boolean,
    isCopied: Boolean,
    isEllipsis: Boolean,
    expanded: Boolean,
    forceRenderExpand: Boolean,
    editTooltipProps: Object,
    copyTooltipProps: Object
  },
  emits: {
    edit: () => true,
    copy: () => true,
    expand: () => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("typography");
    const showExpand = computed(
      () => props.forceRenderExpand || props.expandable && props.isEllipsis
    );
    const { t } = useI18n();
    return {
      prefixCls,
      showExpand,
      t,
      onEditClick() {
        emit("edit");
      },
      onCopyClick() {
        emit("copy");
      },
      onExpandClick() {
        emit("expand");
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconEdit = resolveComponent("IconEdit");
  const _component_Tooltip = resolveComponent("Tooltip");
  const _component_IconCheckCircleFill = resolveComponent("IconCheckCircleFill");
  const _component_IconCopy = resolveComponent("IconCopy");
  return openBlock(), createElementBlock(Fragment, null, [
    _ctx.editable ? (openBlock(), createBlock(_component_Tooltip, mergeProps({
      key: 0,
      content: _ctx.t("typography.edit")
    }, _ctx.editTooltipProps), {
      default: withCtx(() => [
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.prefixCls}-operation-edit`),
          onClick: _cache[0] || (_cache[0] = withModifiers((...args) => _ctx.onEditClick && _ctx.onEditClick(...args), ["stop"]))
        }, [
          createVNode(_component_IconEdit)
        ], 2)
      ]),
      _: 1
    }, 16, ["content"])) : createCommentVNode("v-if", true),
    _ctx.copyable ? (openBlock(), createBlock(_component_Tooltip, normalizeProps(mergeProps({ key: 1 }, _ctx.copyTooltipProps)), {
      content: withCtx(() => [
        renderSlot(_ctx.$slots, "copy-tooltip", { copied: _ctx.isCopied }, () => [
          createTextVNode(toDisplayString(_ctx.isCopied ? _ctx.t("typography.copied") : _ctx.t("typography.copy")), 1)
        ])
      ]),
      default: withCtx(() => [
        createElementVNode("span", {
          class: normalizeClass({
            [`${_ctx.prefixCls}-operation-copied`]: _ctx.isCopied,
            [`${_ctx.prefixCls}-operation-copy`]: !_ctx.isCopied
          }),
          onClick: _cache[1] || (_cache[1] = withModifiers((...args) => _ctx.onCopyClick && _ctx.onCopyClick(...args), ["stop"]))
        }, [
          renderSlot(_ctx.$slots, "copy-icon", { copied: _ctx.isCopied }, () => [
            _ctx.isCopied ? (openBlock(), createBlock(_component_IconCheckCircleFill, { key: 0 })) : (openBlock(), createBlock(_component_IconCopy, { key: 1 }))
          ])
        ], 2)
      ]),
      _: 3
    }, 16)) : createCommentVNode("v-if", true),
    _ctx.showExpand ? (openBlock(), createElementBlock("a", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-operation-expand`),
      onClick: _cache[2] || (_cache[2] = withModifiers((...args) => _ctx.onExpandClick && _ctx.onExpandClick(...args), ["stop"]))
    }, [
      renderSlot(_ctx.$slots, "expand-node", { expanded: _ctx.expanded }, () => [
        createTextVNode(toDisplayString(_ctx.expanded ? _ctx.t("typography.collapse") : _ctx.t("typography.expand")), 1)
      ])
    ], 2)) : createCommentVNode("v-if", true)
  ], 64);
}
var Operations = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Operations as default };
