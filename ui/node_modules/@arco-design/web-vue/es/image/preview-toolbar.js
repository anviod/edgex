import _sfc_main from "./preview-toolbar.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, createBlock, withCtx, createVNode, renderSlot } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RenderFunction = resolveComponent("RenderFunction");
  const _component_PreviewAction = resolveComponent("PreviewAction");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.resultActions, (action) => {
      return openBlock(), createBlock(_component_PreviewAction, {
        key: action.key,
        name: action.name,
        disabled: action.disabled,
        onClick: action.onClick
      }, {
        default: withCtx(() => [
          createVNode(_component_RenderFunction, {
            "render-func": action.content
          }, null, 8, ["render-func"])
        ]),
        _: 2
      }, 1032, ["name", "disabled", "onClick"]);
    }), 128)),
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var PreviewToolbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PreviewToolbar as default };
