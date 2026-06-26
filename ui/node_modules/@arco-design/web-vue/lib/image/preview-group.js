"use strict";
var previewGroup_vue_vue_type_script_lang = require("./preview-group.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ImagePreview = vue.resolveComponent("ImagePreview");
  return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
    vue.renderSlot(_ctx.$slots, "default"),
    vue.createVNode(_component_ImagePreview, vue.mergeProps({ ..._ctx.$attrs, groupArrowProps: _ctx.groupArrowProps }, {
      "in-group": "",
      src: _ctx.currentUrl,
      visible: _ctx.mergedVisible,
      "mask-closable": _ctx.maskClosable,
      closable: _ctx.closable,
      "actions-layout": _ctx.actionsLayout,
      "popup-container": _ctx.popupContainer,
      "render-to-body": _ctx.renderToBody,
      onClose: _ctx.onClose
    }), vue.createSlots({ _: 2 }, [
      _ctx.$slots.actions ? {
        name: "actions",
        fn: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "actions", { url: _ctx.currentUrl })
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["src", "visible", "mask-closable", "closable", "actions-layout", "popup-container", "render-to-body", "onClose"])
  ], 64);
}
var ImagePreviewGroup = /* @__PURE__ */ pluginVue_exportHelper(previewGroup_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = ImagePreviewGroup;
