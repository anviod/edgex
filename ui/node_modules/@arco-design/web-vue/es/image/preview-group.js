import _sfc_main from "./preview-group.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createElementBlock, Fragment, renderSlot, createVNode, mergeProps, createSlots, withCtx } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ImagePreview = resolveComponent("ImagePreview");
  return openBlock(), createElementBlock(Fragment, null, [
    renderSlot(_ctx.$slots, "default"),
    createVNode(_component_ImagePreview, mergeProps({ ..._ctx.$attrs, groupArrowProps: _ctx.groupArrowProps }, {
      "in-group": "",
      src: _ctx.currentUrl,
      visible: _ctx.mergedVisible,
      "mask-closable": _ctx.maskClosable,
      closable: _ctx.closable,
      "actions-layout": _ctx.actionsLayout,
      "popup-container": _ctx.popupContainer,
      "render-to-body": _ctx.renderToBody,
      onClose: _ctx.onClose
    }), createSlots({ _: 2 }, [
      _ctx.$slots.actions ? {
        name: "actions",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "actions", { url: _ctx.currentUrl })
        ]),
        key: "0"
      } : void 0
    ]), 1040, ["src", "visible", "mask-closable", "closable", "actions-layout", "popup-container", "render-to-body", "onClose"])
  ], 64);
}
var ImagePreviewGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ImagePreviewGroup as default };
