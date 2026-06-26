"use strict";
var sider_vue_vue_type_script_lang = require("./sider.vue_vue_type_script_lang.js");
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _hoisted_1 = { key: 0 };
const _hoisted_2 = { key: 1 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLeft = vue.resolveComponent("IconLeft");
  const _component_IconRight = vue.resolveComponent("IconRight");
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.componentTag), vue.mergeProps({
    class: _ctx.classNames,
    style: { width: _ctx.siderWidth }
  }, _ctx.resizeDirections ? { directions: _ctx.resizeDirections } : {}), {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-children`)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 2),
      _ctx.showTrigger ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.triggerClassNames),
        style: vue.normalizeStyle({ width: _ctx.siderWidth }),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.toggleTrigger && _ctx.toggleTrigger(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "trigger", { collapsed: _ctx.localCollapsed }, () => [
          !_ctx.reverseArrow ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            !_ctx.localCollapsed ? (vue.openBlock(), vue.createBlock(_component_IconLeft, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconRight, { key: 1 }))
          ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
            _ctx.localCollapsed ? (vue.openBlock(), vue.createBlock(_component_IconLeft, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconRight, { key: 1 }))
          ]))
        ])
      ], 6)) : vue.createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 16, ["class", "style"]);
}
var LayoutSider = /* @__PURE__ */ pluginVue_exportHelper(sider_vue_vue_type_script_lang, [["render", _sfc_render]]);
module.exports = LayoutSider;
