"use strict";
var vue = require("vue");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "ExpandTransition",
  setup() {
    return {
      onBeforeEnter(el) {
        el.style.height = "0";
      },
      onEnter(el) {
        el.style.height = `${el.scrollHeight}px`;
      },
      onAfterEnter(el) {
        el.style.height = "";
      },
      onBeforeLeave(el) {
        el.style.height = `${el.scrollHeight}px`;
      },
      onLeave(el) {
        el.style.height = `0`;
      },
      onAfterLeave(el) {
        el.style.height = ``;
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock(vue.Transition, {
    onBeforeEnter: _ctx.onBeforeEnter,
    onEnter: _ctx.onEnter,
    onAfterEnter: _ctx.onAfterEnter,
    onBeforeLeave: _ctx.onBeforeLeave,
    onLeave: _ctx.onLeave,
    onAfterLeave: _ctx.onAfterLeave
  }, {
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["onBeforeEnter", "onEnter", "onAfterEnter", "onBeforeLeave", "onLeave", "onAfterLeave"]);
}
var ExpandTransition = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ExpandTransition;
