import { defineComponent, computed, ref, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { hexToRgb, rgbToHsv } from "../_utils/color.js";
import { useI18n } from "../locale/index.js";
import useState from "../_hooks/use-state.js";
import ControlBar from "./control-bar.js";
import Palette from "./palette.js";
import Select from "../select/index.js";
import InputRgb from "./input-rgb.js";
import InputHex from "./input-hex.js";
var Panel = defineComponent({
  name: "Panel",
  props: {
    color: {
      type: Object,
      required: true
    },
    alpha: {
      type: Number,
      required: true
    },
    colorString: String,
    disabled: Boolean,
    disabledAlpha: Boolean,
    showHistory: Boolean,
    showPreset: Boolean,
    format: String,
    historyColors: Array,
    presetColors: Array,
    onAlphaChange: Function,
    onHsvChange: Function
  },
  setup(props) {
    const {
      t
    } = useI18n();
    const prefixCls = getPrefixCls("color-picker");
    const hsv = computed(() => props.color.hsv);
    const [format, setFormat] = useState(props.format || "hex");
    const onChange = (value) => {
      setFormat(value);
    };
    ref(false);
    const onHexInputChange = (value) => {
      var _a;
      const _rgb = hexToRgb(value) || {
        r: 255,
        g: 0,
        b: 0
      };
      const _hsv = rgbToHsv(_rgb.r, _rgb.g, _rgb.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, _hsv);
    };
    const renderInput = () => {
      const commonProps = {
        color: props.color,
        alpha: props.alpha,
        disabled: props.disabled,
        disabledAlpha: props.disabledAlpha,
        onHsvChange: props.onHsvChange,
        onAlphaChange: props.onAlphaChange
      };
      if (format.value === "rgb") {
        return createVNode(InputRgb, commonProps, null);
      }
      return createVNode(InputHex, commonProps, null);
    };
    const renderColorBlock = (color) => {
      return createVNode("div", {
        "key": color,
        "class": `${prefixCls}-color-block`,
        "style": {
          backgroundColor: color
        },
        "onClick": () => onHexInputChange(color)
      }, [createVNode("div", {
        "class": `${prefixCls}-block`,
        "style": {
          backgroundColor: color
        }
      }, null)]);
    };
    const renderColorSection = (text, colors) => createVNode("div", {
      "class": `${prefixCls}-colors-section`
    }, [createVNode("div", {
      "class": `${prefixCls}-colors-text`
    }, [text]), createVNode("div", {
      "class": `${prefixCls}-colors-wrapper`
    }, [(colors == null ? void 0 : colors.length) ? createVNode("div", {
      "class": `${prefixCls}-colors-list`
    }, [colors.map(renderColorBlock)]) : createVNode("span", {
      "class": `${prefixCls}-colors-empty`
    }, [t("colorPicker.empty")])])]);
    const renderColorSec = () => {
      if (props.showHistory || props.showPreset) {
        return createVNode("div", {
          "class": `${prefixCls}-panel-colors`
        }, [props.showHistory && renderColorSection(t("colorPicker.history"), props.historyColors), props.showPreset && renderColorSection(t("colorPicker.preset"), props.presetColors)]);
      }
      return null;
    };
    return () => createVNode("div", {
      "class": {
        [`${prefixCls}-panel`]: true,
        [`${prefixCls}-panel-disabled`]: props.disabled
      }
    }, [createVNode(Palette, {
      "color": props.color,
      "onChange": (s, v) => {
        var _a;
        return (_a = props.onHsvChange) == null ? void 0 : _a.call(props, {
          h: hsv.value.h,
          s,
          v
        });
      }
    }, null), createVNode("div", {
      "class": `${prefixCls}-panel-control`
    }, [createVNode("div", {
      "class": `${prefixCls}-control-wrapper`
    }, [createVNode("div", null, [createVNode(ControlBar, {
      "type": "hue",
      "x": hsv.value.h,
      "color": props.color,
      "colorString": props.colorString,
      "onChange": (h) => {
        var _a;
        return (_a = props.onHsvChange) == null ? void 0 : _a.call(props, {
          h,
          s: hsv.value.s,
          v: hsv.value.v
        });
      }
    }, null), !props.disabledAlpha && createVNode(ControlBar, {
      "type": "alpha",
      "x": props.alpha,
      "color": props.color,
      "colorString": props.colorString,
      "onChange": props.onAlphaChange
    }, null)]), createVNode("div", {
      "class": `${prefixCls}-preview`,
      "style": {
        backgroundColor: props.colorString
      }
    }, null)]), createVNode("div", {
      "class": `${prefixCls}-input-wrapper`
    }, [createVNode(Select, {
      "class": `${prefixCls}-select`,
      "size": "mini",
      "trigger-props": {
        class: `${prefixCls}-select-popup`
      },
      "options": [{
        value: "hex",
        label: "Hex"
      }, {
        value: "rgb",
        label: "RGB"
      }],
      "modelValue": format.value,
      "onChange": onChange
    }, null), createVNode("div", {
      "class": `${prefixCls}-group-wrapper`
    }, [renderInput()])])]), renderColorSec()]);
  }
});
export { Panel as default };
