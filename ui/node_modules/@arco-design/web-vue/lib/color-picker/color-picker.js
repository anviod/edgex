"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var colors = require("./colors.js");
var panel = require("./panel.js");
var index = require("../trigger/index.js");
var useState = require("../_hooks/use-state.js");
var color = require("../_utils/color.js");
var _ColorPicker = vue.defineComponent({
  name: "ColorPicker",
  props: {
    modelValue: String,
    defaultValue: {
      type: String
    },
    format: {
      type: String
    },
    size: {
      type: String,
      default: "medium"
    },
    showText: {
      type: Boolean,
      default: false
    },
    showHistory: {
      type: Boolean,
      default: false
    },
    showPreset: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledAlpha: {
      type: Boolean,
      default: false
    },
    hideTrigger: {
      type: Boolean
    },
    triggerProps: {
      type: Object
    },
    historyColors: {
      type: Array
    },
    presetColors: {
      type: Array,
      default: () => colors.colors
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true,
    "popup-visible-change": (visible, value) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    const mergeValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : props.defaultValue;
    });
    const formatInput = vue.computed(() => {
      return color.formatInputToHSVA(mergeValue.value || "");
    });
    const [alpha, setAlpha] = useState(formatInput.value.a);
    const [hsv, setHsv] = useState({
      h: formatInput.value.h,
      s: formatInput.value.s,
      v: formatInput.value.v
    });
    vue.watch(() => formatInput.value, (value) => {
      if (mergeValue.value !== formatValue.value) {
        setAlpha(value.a);
        setHsv({
          h: value.h,
          s: value.s,
          v: value.v
        });
      }
    });
    const color$1 = vue.computed(() => {
      const rgb = color.hsvToRgb(hsv.value.h, hsv.value.s, hsv.value.v);
      const hex = color.rgbToHex(rgb.r, rgb.g, rgb.b);
      return {
        hsv: hsv.value,
        rgb,
        hex
      };
    });
    const colorString = vue.computed(() => {
      const {
        r,
        g,
        b
      } = color$1.value.rgb;
      return `rgba(${r}, ${g}, ${b}, ${alpha.value.toFixed(2)})`;
    });
    const formatValue = vue.computed(() => {
      const {
        r,
        g,
        b
      } = color$1.value.rgb;
      if (props.format === "rgb") {
        return alpha.value < 1 && !props.disabledAlpha ? `rgba(${r}, ${g}, ${b}, ${alpha.value.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
      }
      return alpha.value < 1 && !props.disabledAlpha ? `#${color.rgbaToHex(r, g, b, alpha.value)}` : `#${color.rgbToHex(r, g, b)}`;
    });
    vue.watch(formatValue, (value) => {
      emit("update:modelValue", value);
      emit("change", value);
    });
    const onHsvChange = (_value) => {
      !props.disabled && setHsv(_value);
    };
    const onAlphaChange = (_value) => {
      !props.disabled && setAlpha(_value);
    };
    const onPopupVisibleChange = (visible) => {
      emit("popup-visible-change", visible, formatValue.value);
    };
    const renderInput = () => {
      return vue.createVNode("div", {
        "class": {
          [prefixCls]: true,
          [`${prefixCls}-size-${props.size}`]: props.size,
          [`${prefixCls}-disabled`]: props.disabled
        }
      }, [vue.createVNode("div", {
        "class": `${prefixCls}-preview`,
        "style": {
          backgroundColor: formatValue.value
        }
      }, null), props.showText && vue.createVNode("div", {
        "class": `${prefixCls}-value`
      }, [formatValue.value]), vue.createVNode("input", {
        "class": `${prefixCls}-input`,
        "value": formatValue.value,
        "disabled": props.disabled
      }, null)]);
    };
    const renderPanel = () => {
      return vue.createVNode(panel, {
        "color": color$1.value,
        "alpha": alpha.value,
        "colorString": colorString.value,
        "historyColors": props.historyColors,
        "presetColors": props.presetColors,
        "showHistory": props.showHistory,
        "showPreset": props.showPreset,
        "disabled": props.disabled,
        "disabledAlpha": props.disabledAlpha,
        "format": props.format,
        "onHsvChange": onHsvChange,
        "onAlphaChange": onAlphaChange
      }, null);
    };
    return () => {
      return props.hideTrigger ? renderPanel() : vue.createVNode(index, vue.mergeProps({
        "trigger": "click",
        "position": "bl",
        "animationName": "slide-dynamic-origin",
        "popupOffset": 4,
        "disabled": props.disabled,
        "onPopupVisibleChange": onPopupVisibleChange
      }, props.triggerProps), {
        default: () => [slots.default ? slots.default() : renderInput()],
        content: renderPanel
      });
    };
  }
});
module.exports = _ColorPicker;
