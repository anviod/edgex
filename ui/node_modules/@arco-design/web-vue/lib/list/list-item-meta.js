"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "ListItemMeta",
  props: {
    title: String,
    description: String
  },
  setup(props, { slots }) {
    const prefixCls = globalConfig.getPrefixCls("list-item-meta");
    const hasContent = Boolean(
      props.title || props.description || slots.title || slots.description
    );
    return {
      prefixCls,
      hasContent
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.$slots.avatar ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-avatar`)
    }, [
      vue.renderSlot(_ctx.$slots, "avatar")
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.hasContent ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      _ctx.$slots.title || _ctx.title ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        vue.renderSlot(_ctx.$slots, "title", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
        ])
      ], 2)) : vue.createCommentVNode("v-if", true),
      _ctx.$slots.description || _ctx.description ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-description`)
      }, [
        vue.renderSlot(_ctx.$slots, "description", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
        ])
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var ListItemMeta = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ListItemMeta;
