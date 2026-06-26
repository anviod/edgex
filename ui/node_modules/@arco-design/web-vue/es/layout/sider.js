import _sfc_main from "./sider.vue_vue_type_script_lang.js";
import { resolveComponent, openBlock, createBlock, resolveDynamicComponent, mergeProps, withCtx, createElementVNode, normalizeClass, renderSlot, createElementBlock, normalizeStyle, createCommentVNode } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLeft = resolveComponent("IconLeft");
  const _component_IconRight = resolveComponent("IconRight");
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.componentTag), mergeProps({
    class: _ctx.classNames,
    style: { width: _ctx.siderWidth }
  }, _ctx.resizeDirections ? { directions: _ctx.resizeDirections } : {}), {
    default: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-children`)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2),
      _ctx.showTrigger ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(_ctx.triggerClassNames),
        style: normalizeStyle({ width: _ctx.siderWidth }),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.toggleTrigger && _ctx.toggleTrigger(...args))
      }, [
        renderSlot(_ctx.$slots, "trigger", { collapsed: _ctx.localCollapsed }, () => [
          !_ctx.reverseArrow ? (openBlock(), createElementBlock("div", _hoisted_1, [
            !_ctx.localCollapsed ? (openBlock(), createBlock(_component_IconLeft, { key: 0 })) : (openBlock(), createBlock(_component_IconRight, { key: 1 }))
          ])) : (openBlock(), createElementBlock("div", _hoisted_2, [
            _ctx.localCollapsed ? (openBlock(), createBlock(_component_IconLeft, { key: 0 })) : (openBlock(), createBlock(_component_IconRight, { key: 1 }))
          ]))
        ])
      ], 6)) : createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 16, ["class", "style"]);
}
var LayoutSider = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LayoutSider as default };
