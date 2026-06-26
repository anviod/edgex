import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, Fragment, createVNode, createElementVNode, createCommentVNode } from "vue";
import InputNumber from "../input-number/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SliderInput",
  components: {
    InputNumber
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
    const prefixCls = getPrefixCls("slider");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_input_number = resolveComponent("input-number");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-input`)
  }, [
    _ctx.range ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createVNode(_component_input_number, {
        min: _ctx.min,
        max: _ctx.max,
        step: _ctx.step,
        disabled: _ctx.disabled,
        "model-value": _ctx.modelValue[0],
        "hide-button": "",
        onChange: _cache[0] || (_cache[0] = (value) => _ctx.$emit("startChange", value))
      }, null, 8, ["min", "max", "step", "disabled", "model-value"]),
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-input-hyphens`)
      }, null, 2)
    ], 64)) : createCommentVNode("v-if", true),
    createVNode(_component_input_number, {
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
var SliderInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SliderInput as default };
