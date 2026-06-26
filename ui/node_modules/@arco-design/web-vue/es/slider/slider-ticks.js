import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, Fragment, renderList, normalizeStyle } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import { getPositionStyle, getOffsetPercent } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    const prefixCls = getPrefixCls("slider");
    const steps = computed(() => {
      const steps2 = [];
      const stepsLength = Math.floor((props.max - props.min) / props.step);
      for (let i = 0; i <= stepsLength; i++) {
        const stepVal = NP.plus(i * props.step, props.min);
        if (stepVal <= props.min || stepVal >= props.max)
          continue;
        steps2.push({
          key: stepVal,
          isActive: stepVal >= props.value[0] && stepVal <= props.value[1]
        });
      }
      return steps2;
    });
    const getStyle = (value) => getPositionStyle(
      getOffsetPercent(value, [props.min, props.max]),
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
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-ticks`)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.steps, (item, index) => {
      return openBlock(), createElementBlock("div", {
        key: index,
        class: normalizeClass([
          `${_ctx.prefixCls}-tick`,
          { [`${_ctx.prefixCls}-tick-active`]: item.isActive }
        ]),
        style: normalizeStyle(_ctx.getStyle(item.key))
      }, null, 6);
    }), 128))
  ], 2);
}
var SliderTicks = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SliderTicks as default };
