"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const _sfc_main = vue.defineComponent({
  name: "SliderTicks",
  props: {
    value: {
      type: Array,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      default: "horizontal"
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("slider");
    const steps = vue.computed(() => {
      const steps2 = [];
      const stepsLength = Math.floor((props.max - props.min) / props.step);
      for (let i = 0; i <= stepsLength; i++) {
        const stepVal = NP__default["default"].plus(i * props.step, props.min);
        if (stepVal <= props.min || stepVal >= props.max)
          continue;
        steps2.push({
          key: stepVal,
          isActive: stepVal >= props.value[0] && stepVal <= props.value[1]
        });
      }
      return steps2;
    });
    const getStyle = (value) => utils.getPositionStyle(
      utils.getOffsetPercent(value, [props.min, props.max]),
      props.direction
    );
    return {
      prefixCls,
      steps,
      getStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-ticks`)
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.steps, (item, index) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        key: index,
        class: vue.normalizeClass([
          `${_ctx.prefixCls}-tick`,
          { [`${_ctx.prefixCls}-tick-active`]: item.isActive }
        ]),
        style: vue.normalizeStyle(_ctx.getStyle(item.key))
      }, null, 6);
    }), 128))
  ], 2);
}
var SliderTicks = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SliderTicks;
