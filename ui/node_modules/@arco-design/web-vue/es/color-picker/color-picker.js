import { defineComponent, computed, watch, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { colors } from "./colors.js";
import Panel from "./panel.js";
import Trigger from "../trigger/index.js";
import useState from "../_hooks/use-state.js";
import { formatInputToHSVA, hsvToRgb, rgbToHex, rgbaToHex } from "../_utils/color.js";
var _ColorPicker = defineComponent({
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
      default: () => colors
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
    const prefixCls = getPrefixCls("color-picker");
    const mergeValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : props.defaultValue;
    });
    const formatInput = computed(() => {
      return formatInputToHSVA(mergeValue.value || "");
    });
    const [alpha, setAlpha] = useState(formatInput.value.a);
    const [hsv, setHsv] = useState({
      h: formatInput.value.h,
      s: formatInput.value.s,
      v: formatInput.value.v
    });
    watch(() => formatInput.value, (value) => {
      if (mergeValue.value !== formatValue.value) {
        setAlpha(value.a);
        setHsv({
          h: value.h,
          s: value.s,
          v: value.v
        });
      }
    });
    const color = computed(() => {
      const rgb = hsvToRgb(hsv.value.h, hsv.value.s, hsv.value.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      return {
        hsv: hsv.value,
        rgb,
        hex
      };
    });
    const colorString = computed(() => {
      const {
        r,
        g,
        b
      } = color.value.rgb;
      return `rgba(${r}, ${g}, ${b}, ${alpha.value.toFixed(2)})`;
    });
    const formatValue = computed(() => {
      const {
        r,
        g,
        b
      } = color.value.rgb;
      if (props.format === "rgb") {
        return alpha.value < 1 && !props.disabledAlpha ? `rgba(${r}, ${g}, ${b}, ${alpha.value.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
      }
      return alpha.value < 1 && !props.disabledAlpha ? `#${rgbaToHex(r, g, b, alpha.value)}` : `#${rgbToHex(r, g, b)}`;
    });
    watch(formatValue, (value) => {
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
      return createVNode("div", {
        "class": {
          [prefixCls]: true,
          [`${prefixCls}-size-${props.size}`]: props.size,
          [`${prefixCls}-disabled`]: props.disabled
        }
      }, [createVNode("div", {
        "class": `${prefixCls}-preview`,
        "style": {
          backgroundColor: formatValue.value
        }
      }, null), props.showText && createVNode("div", {
        "class": `${prefixCls}-value`
      }, [formatValue.value]), createVNode("input", {
        "class": `${prefixCls}-input`,
        "value": formatValue.value,
        "disabled": props.disabled
      }, null)]);
    };
    const renderPanel = () => {
      return createVNode(Panel, {
        "color": color.value,
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
      return props.hideTrigger ? renderPanel() : createVNode(Trigger, mergeProps({
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
export { _ColorPicker as default };
