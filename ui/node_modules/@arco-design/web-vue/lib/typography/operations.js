"use strict";
var vue = require("vue");
var index = require("../tooltip/index.js");
var index$1 = require("../icon/icon-check-circle-fill/index.js");
var index$2 = require("../icon/icon-copy/index.js");
var index$3 = require("../icon/icon-edit/index.js");
var globalConfig = require("../_utils/global-config.js");
var index$4 = require("../locale/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TypographyOperations",
  components: {
    Tooltip: index,
    IconCheckCircleFill: index$1,
    IconCopy: index$2,
    IconEdit: index$3
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
    const prefixCls = globalConfig.getPrefixCls("typography");
    const showExpand = vue.computed(
      () => props.forceRenderExpand || props.expandable && props.isEllipsis
    );
    const { t } = index$4.useI18n();
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
  const _component_IconEdit = vue.resolveComponent("IconEdit");
  const _component_Tooltip = vue.resolveComponent("Tooltip");
  const _component_IconCheckCircleFill = vue.resolveComponent("IconCheckCircleFill");
  const _component_IconCopy = vue.resolveComponent("IconCopy");
  return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
    _ctx.editable ? (vue.openBlock(), vue.createBlock(_component_Tooltip, vue.mergeProps({
      key: 0,
      content: _ctx.t("typography.edit")
    }, _ctx.editTooltipProps), {
      default: vue.withCtx(() => [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-operation-edit`),
          onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => _ctx.onEditClick && _ctx.onEditClick(...args), ["stop"]))
        }, [
          vue.createVNode(_component_IconEdit)
        ], 2)
      ]),
      _: 1
    }, 16, ["content"])) : vue.createCommentVNode("v-if", true),
    _ctx.copyable ? (vue.openBlock(), vue.createBlock(_component_Tooltip, vue.normalizeProps(vue.mergeProps({ key: 1 }, _ctx.copyTooltipProps)), {
      content: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "copy-tooltip", { copied: _ctx.isCopied }, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.isCopied ? _ctx.t("typography.copied") : _ctx.t("typography.copy")), 1)
        ])
      ]),
      default: vue.withCtx(() => [
        vue.createElementVNode("span", {
          class: vue.normalizeClass({
            [`${_ctx.prefixCls}-operation-copied`]: _ctx.isCopied,
            [`${_ctx.prefixCls}-operation-copy`]: !_ctx.isCopied
          }),
          onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.onCopyClick && _ctx.onCopyClick(...args), ["stop"]))
        }, [
          vue.renderSlot(_ctx.$slots, "copy-icon", { copied: _ctx.isCopied }, () => [
            _ctx.isCopied ? (vue.openBlock(), vue.createBlock(_component_IconCheckCircleFill, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconCopy, { key: 1 }))
          ])
        ], 2)
      ]),
      _: 3
    }, 16)) : vue.createCommentVNode("v-if", true),
    _ctx.showExpand ? (vue.openBlock(), vue.createElementBlock("a", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-operation-expand`),
      onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => _ctx.onExpandClick && _ctx.onExpandClick(...args), ["stop"]))
    }, [
      vue.renderSlot(_ctx.$slots, "expand-node", { expanded: _ctx.expanded }, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.expanded ? _ctx.t("typography.collapse") : _ctx.t("typography.expand")), 1)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 64);
}
var Operations = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Operations;
