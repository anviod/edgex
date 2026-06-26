"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Dgroup",
  props: {
    title: String
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("dropdown-group");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
    vue.createElementVNode("li", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      vue.renderSlot(_ctx.$slots, "title", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ])
    ], 2),
    vue.renderSlot(_ctx.$slots, "default")
  ], 64);
}
var Dgroup = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Dgroup;
