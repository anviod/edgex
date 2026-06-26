"use strict";
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "ExpandTransition",
  props: {
    expanded: Boolean
  },
  emits: ["end"],
  setup(props, { emit }) {
    return {
      onEnter(el) {
        const endHeight = `${el.scrollHeight}px`;
        el.style.height = props.expanded ? "0" : endHeight;
        el.offsetHeight;
        el.style.height = props.expanded ? endHeight : "0";
      },
      onAfterEnter(el) {
        el.style.height = props.expanded ? "" : "0";
        emit("end");
      },
      onBeforeLeave(el) {
        el.style.display = "none";
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createBlock(vue.Transition, {
    onEnter: _ctx.onEnter,
    onAfterEnter: _ctx.onAfterEnter,
    onBeforeLeave: _ctx.onBeforeLeave
  }, {
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["onEnter", "onAfterEnter", "onBeforeLeave"]);
}
var ExpandTransition = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ExpandTransition;
