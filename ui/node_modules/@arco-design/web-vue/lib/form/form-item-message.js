"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "FormItemMessage",
  props: {
    error: {
      type: Array,
      default: () => []
    },
    help: String
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("form-item-message");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.error.length > 0 ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(_ctx.error, (item) => {
    return vue.openBlock(), vue.createBlock(vue.Transition, {
      key: item,
      name: "form-blink",
      appear: ""
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("div", {
          role: "alert",
          class: vue.normalizeClass([_ctx.prefixCls])
        }, vue.toDisplayString(item), 3)
      ]),
      _: 2
    }, 1024);
  }), 128)) : _ctx.help || _ctx.$slots.help ? (vue.openBlock(), vue.createBlock(vue.Transition, {
    key: 1,
    name: "form-blink",
    appear: ""
  }, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass([_ctx.prefixCls, `${_ctx.prefixCls}-help`])
      }, [
        vue.renderSlot(_ctx.$slots, "help", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.help), 1)
        ])
      ], 2)
    ]),
    _: 3
  })) : vue.createCommentVNode("v-if", true);
}
var FormItemMessage = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = FormItemMessage;
