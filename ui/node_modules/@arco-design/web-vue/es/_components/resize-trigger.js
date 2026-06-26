import _sfc_main from "./resize-trigger.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createBlock, withCtx, createElementVNode, normalizeClass, createCommentVNode, renderSlot } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconDragDot = resolveComponent("IconDragDot");
  const _component_IconDragDotVertical = resolveComponent("IconDragDotVertical");
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  return openBlock(), createBlock(_component_ResizeObserver, { onResize: _ctx.onResize }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass(_ctx.classNames)
      }, [
        createCommentVNode(" @slot \u81EA\u5B9A\u4E49\u5185\u5BB9 "),
        renderSlot(_ctx.$slots, "default", {}, () => [
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-icon-wrapper`)
          }, [
            createCommentVNode(" @slot \u81EA\u5B9A\u4E49 icon "),
            renderSlot(_ctx.$slots, "icon", {}, () => [
              _ctx.isHorizontal ? (openBlock(), createBlock(_component_IconDragDot, {
                key: 0,
                class: normalizeClass(`${_ctx.prefixCls}-icon`)
              }, null, 8, ["class"])) : (openBlock(), createBlock(_component_IconDragDotVertical, {
                key: 1,
                class: normalizeClass(`${_ctx.prefixCls}-icon`)
              }, null, 8, ["class"]))
            ])
          ], 2)
        ])
      ], 2)
    ]),
    _: 3
  }, 8, ["onResize"]);
}
var ResizeTrigger = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ResizeTrigger as default };
