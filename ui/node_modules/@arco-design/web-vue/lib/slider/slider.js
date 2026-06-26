"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var sliderButton = require("./slider-button.js");
var sliderDots = require("./slider-dots.js");
var sliderMarks = require("./slider-marks.js");
var sliderTicks = require("./slider-ticks.js");
var sliderInput = require("./slider-input.js");
var is = require("../_utils/is.js");
var utils = require("./utils.js");
var useFormItem = require("../_hooks/use-form-item.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const _sfc_main = vue.defineComponent({
  name: "Slider",
  components: {
    SliderButton: sliderButton,
    SliderDots: sliderDots,
    SliderMarks: sliderMarks,
    SliderTicks: sliderTicks,
    SliderInput: sliderInput
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
    const { modelValue } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("slider");
    const { mergedDisabled, eventHandlers } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const trackRef = vue.ref(null);
    const trackRect = vue.ref();
    const defaultValue = props.modelValue ? props.modelValue : props.defaultValue;
    const startValue = vue.ref(is.isArray(defaultValue) ? defaultValue[0] : 0);
    const endValue = vue.ref(
      is.isArray(defaultValue) ? defaultValue[1] : defaultValue
    );
    vue.watch(modelValue, (value) => {
      var _a, _b, _c, _d, _e;
      if (is.isArray(value)) {
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
    const computedValue = vue.computed(() => {
      var _a, _b, _c;
      if (props.range) {
        if (is.isArray(props.modelValue)) {
          return props.modelValue;
        }
        return [startValue.value, (_a = props.modelValue) != null ? _a : endValue.value];
      }
      if (is.isUndefined(props.modelValue)) {
        return [startValue.value, endValue.value];
      }
      if (is.isArray(props.modelValue)) {
        return [(_b = props.min) != null ? _b : 0, props.modelValue[1]];
      }
      return [(_c = props.min) != null ? _c : 0, props.modelValue];
    });
    const markList = vue.computed(
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
    const getBtnStyle = (value) => utils.getPositionStyle(
      utils.getOffsetPercent(value, [props.min, props.max]),
      props.direction
    );
    const isDragging = vue.ref(false);
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
      return NP__default["default"].plus(props.min, NP__default["default"].times(steps, props.step));
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
        bottom: utils.getOffsetPercent(start, [props.min, props.max]),
        top: utils.getOffsetPercent(props.max + props.min - end, [
          props.min,
          props.max
        ])
      } : {
        left: utils.getOffsetPercent(start, [props.min, props.max]),
        right: utils.getOffsetPercent(props.max + props.min - end, [
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
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-vertical`]: props.direction === "vertical",
        [`${prefixCls}-with-marks`]: Boolean(props.marks)
      }
    ]);
    const trackCls = vue.computed(() => [
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
  const _component_slider_ticks = vue.resolveComponent("slider-ticks");
  const _component_slider_dots = vue.resolveComponent("slider-dots");
  const _component_slider_marks = vue.resolveComponent("slider-marks");
  const _component_slider_button = vue.resolveComponent("slider-button");
  const _component_slider_input = vue.resolveComponent("slider-input");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createElementVNode("div", {
      ref: "trackRef",
      class: vue.normalizeClass(_ctx.trackCls),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-bar`),
        style: vue.normalizeStyle(_ctx.getBarStyle(_ctx.computedValue))
      }, null, 6),
      _ctx.showTicks ? (vue.openBlock(), vue.createBlock(_component_slider_ticks, {
        key: 0,
        value: _ctx.computedValue,
        step: _ctx.step,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["value", "step", "min", "max", "direction"])) : vue.createCommentVNode("v-if", true),
      _ctx.marks ? (vue.openBlock(), vue.createBlock(_component_slider_dots, {
        key: 1,
        data: _ctx.markList,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["data", "min", "max", "direction"])) : vue.createCommentVNode("v-if", true),
      _ctx.marks ? (vue.openBlock(), vue.createBlock(_component_slider_marks, {
        key: 2,
        data: _ctx.markList,
        min: _ctx.min,
        max: _ctx.max,
        direction: _ctx.direction
      }, null, 8, ["data", "min", "max", "direction"])) : vue.createCommentVNode("v-if", true),
      _ctx.range ? (vue.openBlock(), vue.createBlock(_component_slider_button, {
        key: 3,
        style: vue.normalizeStyle(_ctx.getBtnStyle(_ctx.computedValue[0])),
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
      }, null, 8, ["style", "value", "direction", "disabled", "min", "max", "format-tooltip", "show-tooltip", "onMovestart", "onMoving", "onMoveend"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_slider_button, {
        style: vue.normalizeStyle(_ctx.getBtnStyle(_ctx.computedValue[1])),
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
    _ctx.showInput ? (vue.openBlock(), vue.createBlock(_component_slider_input, {
      key: 0,
      "model-value": _ctx.computedValue,
      min: _ctx.min,
      max: _ctx.max,
      step: _ctx.step,
      range: _ctx.range,
      disabled: _ctx.disabled,
      onStartChange: _ctx.handleStartChange,
      onEndChange: _ctx.handleEndChange
    }, null, 8, ["model-value", "min", "max", "step", "range", "disabled", "onStartChange", "onEndChange"])) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var _Slider = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Slider;
