"use strict";
var previewToolbar_vue_vue_type_script_lang = require("./preview-toolbar.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  const _component_PreviewAction = vue.resolveComponent("PreviewAction");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.resultActions, (action) => {
      return vue.openBlock(), vue.createBlock(_component_PreviewAction, {
        key: action.key,
        name: action.name,
        disabled: action.disabled,
        onClick: action.onClick
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_RenderFunction, {
            "render-func": action.content
          }, null, 8, ["render-func"])
        ]),
        _: 2
      }, 1032, ["name", "disabled", "onClick"]);
    }), 128)),
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var PreviewToolbar = /* @__PURE__ */ pluginVue_exportHelper(previewToolbar_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = PreviewToolbar;
