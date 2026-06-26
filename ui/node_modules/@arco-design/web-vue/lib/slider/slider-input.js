"use strict";
var vue = require("vue");
var index = require("../input-number/index.js");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SliderInput",
  components: {
    InputNumber: index
  },
  props: {
    modelValue: {
      type: Array,
      required: true
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    },
    disabled: {
      type: Boolean
    },
    range: {
      type: Boolean
    }
  },
  emits: ["startChange", "endChange"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("slider");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_input_number = vue.resolveComponent("input-number");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-input`)
  }, [
    _ctx.range ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
      vue.createVNode(_component_input_number, {
        min: _ctx.min,
        max: _ctx.max,
        step: _ctx.step,
        disabled: _ctx.disabled,
        "model-value": _ctx.modelValue[0],
        "hide-button": "",
        onChange: _cache[0] || (_cache[0] = (value) => _ctx.$emit("startChange", value))
      }, null, 8, ["min", "max", "step", "disabled", "model-value"]),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-input-hyphens`)
      }, null, 2)
    ], 64)) : vue.createCommentVNode("v-if", true),
    vue.createVNode(_component_input_number, {
      min: _ctx.min,
      max: _ctx.max,
      step: _ctx.step,
      disabled: _ctx.disabled,
      "model-value": _ctx.modelValue[1],
      "hide-button": "",
      onChange: _cache[1] || (_cache[1] = (value) => _ctx.$emit("endChange", value))
    }, null, 8, ["min", "max", "step", "disabled", "model-value"])
  ], 2);
}
var SliderInput = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SliderInput;
