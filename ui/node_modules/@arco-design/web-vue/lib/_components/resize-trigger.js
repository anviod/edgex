"use strict";
var resizeTrigger_vue_vue_type_script_lang = require("./resize-trigger.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconDragDot = vue.resolveComponent("IconDragDot");
  const _component_IconDragDotVertical = vue.resolveComponent("IconDragDotVertical");
  const _component_ResizeObserver = vue.resolveComponent("ResizeObserver");
  return vue.openBlock(), vue.createBlock(_component_ResizeObserver, { onResize: _ctx.onResize }, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.classNames)
      }, [
        vue.createCommentVNode(" @slot \u81EA\u5B9A\u4E49\u5185\u5BB9 "),
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-icon-wrapper`)
          }, [
            vue.createCommentVNode(" @slot \u81EA\u5B9A\u4E49 icon "),
            vue.renderSlot(_ctx.$slots, "icon", {}, () => [
              _ctx.isHorizontal ? (vue.openBlock(), vue.createBlock(_component_IconDragDot, {
                key: 0,
                class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
              }, null, 8, ["class"])) : (vue.openBlock(), vue.createBlock(_component_IconDragDotVertical, {
                key: 1,
                class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
              }, null, 8, ["class"]))
            ])
          ], 2)
        ])
      ], 2)
    ]),
    _: 3
  }, 8, ["onResize"]);
}
var ResizeTrigger = /* @__PURE__ */ pluginVue_exportHelper(resizeTrigger_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = ResizeTrigger;
