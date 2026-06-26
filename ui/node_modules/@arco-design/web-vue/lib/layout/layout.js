"use strict";
var layout_vue_vue_type_script_lang = require("./layout.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("section", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Layout = /* @__PURE__ */ pluginVue_exportHelper(layout_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = _Layout;
