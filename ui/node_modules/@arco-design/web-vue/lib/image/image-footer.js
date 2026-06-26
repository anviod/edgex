"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "ImageFooter",
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("image-footer");
    return {
      prefixCls
    };
  }
});
const _hoisted_1 = ["title"];
const _hoisted_2 = ["title"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.title || _ctx.description ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-caption`)
    }, [
      _ctx.title ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-caption-title`),
        title: _ctx.title
      }, vue.toDisplayString(_ctx.title), 11, _hoisted_1)) : vue.createCommentVNode("v-if", true),
      _ctx.description ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-caption-description`),
        title: _ctx.description
      }, vue.toDisplayString(_ctx.description), 11, _hoisted_2)) : vue.createCommentVNode("v-if", true)
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-extra`)
    }, [
      vue.renderSlot(_ctx.$slots, "extra")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var ImageFooter = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ImageFooter;
