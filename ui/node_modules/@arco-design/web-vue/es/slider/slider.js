import { defineComponent, toRefs, toRef, ref, watch, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, normalizeStyle, createBlock, createCommentVNode, createVNode } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import SliderButton from "./slider-button.js";
import SliderDots from "./slider-dots.js";
import SliderMarks from "./slider-marks.js";
import SliderTicks from "./slider-ticks.js";
import SliderInput from "./slider-input.js";
import { isArray, isUndefined } from "../_utils/is.js";
import { getPositionStyle, getOffsetPercent } from "./utils.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Slider",
  components: {
    SliderButton,
    SliderDots,
    SliderMarks,
    SliderTicks,
    SliderInput
  },
  props: {
    modelValue: {
      type: [Number, Array],
      default: void 0
    },
    defaultValue: {
      type: [Number, Array],
      default: 0
    },
    step: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    marks: {
      type: Object
    },
    max: {
      type: Number,
      default: 100
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showTicks: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    formatTooltip: {
      type: Function
    },
    showTooltip: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const prefixCls = getPrefixCls("slider");
    const { mergedDisabled, eventHandlers } = useFormItem({
      disabled: toRef(props, "disabled")
    });
    const trackRef = ref(null);
    const trackRect = ref();
    const defaultValue = props.modelValue ? props.modelValue : props.defaultValue;
    const startValue = ref(isArray(defaultValue) ? defaultValue[0] : 0);
    const endValue = ref(
      isArray(defaultValue) ? defaultValue[1] : defaultValue
    );
    watch(modelValue, (value) => {
      var _a, _b, _c, _d, _e;
      if (isArray(value)) {
        startValue.value = (_b = (_a = value[0]) != null ? _a : props.min) != null ? _b : 0;
        endValue.value = (_d = (_c = value[1]) != null ? _c : props.min) != null ? _d : 0;
      } else {
        endValue.value = (_e = value != null ? value : props.min) != null ? _e : 0;
      }
    });
    const handleChange = () => {
      var _a, _b;
      if (props.range) {
        emit("update:modelValue", [startValue.value, endValue.value]);
        emit("change", [startValue.value, endValue.value]);
      } else {
        emit("update:modelValue", endValue.value);
        emit("change", endValue.value);
      }
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
    };
    const handleStartChange = (value) => {
      value = value != null ? value : props.min;
      startValue.value = value;
      handleChange();
    };
    const handleEndChange = (value) => {
      value = value != null ? value : props.min;
      endValue.value = value;
      handleChange();
    };
    const computedValue = computed(() => {
      var _a, _b, _c;
      if (props.range) {
        if (isArray(props.modelValue)) {
          return props.modelValue;
        }
        return [startValue.value, (_a = props.modelValue) != null ? _a : endValue.value];
      }
      if (isUndefined(props.modelValue)) {
        return [startValue.value, endValue.value];
      }
      if (isArray(props.modelValue)) {
        return [(_b = props.min) != null ? _b : 0, props.modelValue[1]];
      }
      return [(_c = props.min) != null ? _c : 0, props.modelValue];
    });
    const markList = computed(
      () => Object.keys(props.marks || {}).map((index) => {
        var _a;
        const key = Number(index);
        return {
          key,
          content: (_a = props.marks) == null ? void 0 : _a[key],
          isActive: key >= computedValue.value[0] && key <= computedValue.value[1]
        };
      })
    );
    const getBtnStyle = (value) => getPositionStyle(
      getOffsetPercent(value, [props.min, props.max]),
      props.direction
    );
    const isDragging = ref(false);
    const handleMoveStart = () => {
      isDragging.value = true;
      if (trackRef.value) {
        trackRect.value = trackRef.value.getBoundingClientRect();
      }
    };
    function getValueByCoords(x, y) {
      if (!trackRect.value) {
        return 0;
      }
      const { left, top, width, height } = trackRect.value;
      const trackLength = props.direction === "horizontal" ? width : height;
      const stepLength = trackLength * props.step / (props.max - props.min);
      let diff = props.direction === "horizontal" ? x - left : top + height - y;
      if (diff < 0)
        diff = 0;
      if (diff > trackLength)
        diff = trackLength;
      const steps = Math.round(diff / stepLength);
      return NP.plus(props.min, NP.times(steps, props.step));
    }
    const handleEndMoving = (x, y) => {
      endValue.value = getValueByCoords(x, y);
      handleChange();
    };
    const handleClick = (e) => {
      if (mergedDisabled.value) {
        return;
      }
      const { clientX, clientY } = e;
      if (trackRef.value) {
        trackRect.value = trackRef.value.getBoundingClientRect();
      }
      endValue.value = getValueByCoords(clientX, clientY);
      handleChange();
    };
    function getBarStyle([start, end]) {
      if (start > end) {
        [start, end] = [end, start];
      }
      return props.direction === "vertical" ? {
        bottom: getOffsetPercent(start, [props.min, props.max]),
        top: getOffsetPercent(props.max + props.min - end, [
          props.min,
          props.max
        ])
      } : {
        left: getOffsetPercent(start, [props.min, props.max]),
        right: getOffsetPercent(props.max + props.min - end, [
          props.min,
          props.max
        ])
      };
    }
    const handleStartMoving = (x, y) => {
      startValue.value = getValueByCoords(x, y);
      handleChange();
    };
    const handleMoveEnd = () => {
      isDragging.value = false;
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-vertical`]: props.direction === "vertical",
        [`${prefixCls}-with-marks`]: Boolean(props.marks)
      }
    ]);
    const trackCls = computed(() => [
      `${prefixCls}-track`,
      {
        [`${prefixCls}-track-disabled`]: mergedDisabled.value,
        [`${prefixCls}-track-vertical`]: props.direction === "vertical"
      }
    ]);
    return {
      prefixCls,
      cls,
      trackCls,
      trackRef,
      computedValue,
      mergedDisabled,
      markList,
      getBtnStyle,
      getBarStyle,
      handleClick,
      handleMoveStart,
      handleEndMoving,
      handleMoveEnd,
      handleStartMoving,
      handleStartChange,
      handleEndChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_slider_ticks = resolveComponent("slider-ticks");
  const _component_slider_dots = resolveComponent("slider-dots");
  const _component_slider_marks = resolveComponent("slider-marks");
  const _component_slider_button = resolveComponent("slider-button");
  const _component_slider_input = resolveComponent("slider-input");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    createElementVNode("div", {
      ref: "trackRef",
      class: normalizeClass(_ctx.trackCls),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-bar`),
        style: normalizeStyle(_ctx.getBarStyle(_ctx.computedValue))
      }, null, 6),
      _ctx.showTicks ? (openBlock(), createBlock(_component_slider_ticks, {
        key: 0,
        value: _ctx.computedValue,
        step: _ctx.step,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["value", "step", "min", "max", "direction"])) : createCommentVNode("v-if", true),
      _ctx.marks ? (openBlock(), createBlock(_component_slider_dots, {
        key: 1,
        data: _ctx.markList,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["data", "min", "max", "direction"])) : createCommentVNode("v-if", true),
      _ctx.marks ? (openBlock(), createBlock(_component_slider_marks, {
        key: 2,
        data: _ctx.markList,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["data", "min", "max", "direction"])) : createCommentVNode("v-if", true),
      _ctx.range ? (openBlock(), createBlock(_component_slider_button, {
        key: 3,
        style: normalizeStyle(_ctx.getBtnStyle(_ctx.computedValue[0])),
        value: _ctx.computedValue[0],
        direction: _ctx.direction,
        disabled: _ctx.mergedDisabled,
        min: _ctx.min,
        max: _ctx.max,
        "format-tooltip": _ctx.formatTooltip,
        "show-tooltip": _ctx.showTooltip,
        onMovestart: _ctx.handleMoveStart,
        onMoving: _ctx.handleStartMoving,
        onMoveend: _ctx.handleMoveEnd
      }, null, 8, ["style", "value", "direction", "disabled", "min", "max", "format-tooltip", "show-tooltip", "onMovestart", "onMoving", "onMoveend"])) : createCommentVNode("v-if", true),
      createVNode(_component_slider_button, {
        style: normalizeStyle(_ctx.getBtnStyle(_ctx.computedValue[1])),
        value: _ctx.computedValue[1],
        direction: _ctx.direction,
        disabled: _ctx.mergedDisabled,
        min: _ctx.min,
        max: _ctx.max,
        "format-tooltip": _ctx.formatTooltip,
        "show-tooltip": _ctx.showTooltip,
        onMovestart: _ctx.handleMoveStart,
        onMoving: _ctx.handleEndMoving,
        onMoveend: _ctx.handleMoveEnd
      }, null, 8, ["style", "value", "direction", "disabled", "min", "max", "format-tooltip", "show-tooltip", "onMovestart", "onMoving", "onMoveend"])
    ], 2),
    _ctx.showInput ? (openBlock(), createBlock(_component_slider_input, {
      key: 0,
      "model-value": _ctx.computedValue,
      min: _ctx.min,
      max: _ctx.max,
      step: _ctx.step,
      range: _ctx.range,
      disabled: _ctx.disabled,
      onStartChange: _ctx.handleStartChange,
      onEndChange: _ctx.handleEndChange
    }, null, 8, ["model-value", "min", "max", "step", "range", "disabled", "onStartChange", "onEndChange"])) : createCommentVNode("v-if", true)
  ], 2);
}
var _Slider = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Slider as default };
