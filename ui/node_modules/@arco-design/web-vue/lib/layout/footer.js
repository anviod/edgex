"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "LayoutFooter",
  setup() {
    const prefixCls = globalConfig.getPrefixCls("layout-footer");
    const classNames = [prefixCls];
    return {
      classNames
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("footer", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var LayoutFooter = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = LayoutFooter;
