"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var color = require("../_utils/color.js");
var index = require("../locale/index.js");
var useState = require("../_hooks/use-state.js");
var controlBar = require("./control-bar.js");
var palette = require("./palette.js");
var index$1 = require("../select/index.js");
var inputRgb = require("./input-rgb.js");
var inputHex = require("./input-hex.js");
var Panel = vue.defineComponent({
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
    } = index.useI18n();
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    const hsv = vue.computed(() => props.color.hsv);
    const [format, setFormat] = useState(props.format || "hex");
    const onChange = (value) => {
      setFormat(value);
    };
    vue.ref(false);
    const onHexInputChange = (value) => {
      var _a;
      const _rgb = color.hexToRgb(value) || {
        r: 255,
        g: 0,
        b: 0
      };
      const _hsv = color.rgbToHsv(_rgb.r, _rgb.g, _rgb.b);
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
        return vue.createVNode(inputRgb, commonProps, null);
      }
      return vue.createVNode(inputHex, commonProps, null);
    };
    const renderColorBlock = (color2) => {
      return vue.createVNode("div", {
        "key": color2,
        "class": `${prefixCls}-color-block`,
        "style": {
          backgroundColor: color2
        },
        "onClick": () => onHexInputChange(color2)
      }, [vue.createVNode("div", {
        "class": `${prefixCls}-block`,
        "style": {
          backgroundColor: color2
        }
      }, null)]);
    };
    const renderColorSection = (text, colors) => vue.createVNode("div", {
      "class": `${prefixCls}-colors-section`
    }, [vue.createVNode("div", {
      "class": `${prefixCls}-colors-text`
    }, [text]), vue.createVNode("div", {
      "class": `${prefixCls}-colors-wrapper`
    }, [(colors == null ? void 0 : colors.length) ? vue.createVNode("div", {
      "class": `${prefixCls}-colors-list`
    }, [colors.map(renderColorBlock)]) : vue.createVNode("span", {
      "class": `${prefixCls}-colors-empty`
    }, [t("colorPicker.empty")])])]);
    const renderColorSec = () => {
      if (props.showHistory || props.showPreset) {
        return vue.createVNode("div", {
          "class": `${prefixCls}-panel-colors`
        }, [props.showHistory && renderColorSection(t("colorPicker.history"), props.historyColors), props.showPreset && renderColorSection(t("colorPicker.preset"), props.presetColors)]);
      }
      return null;
    };
    return () => vue.createVNode("div", {
      "class": {
        [`${prefixCls}-panel`]: true,
        [`${prefixCls}-panel-disabled`]: props.disabled
      }
    }, [vue.createVNode(palette, {
      "color": props.color,
      "onChange": (s, v) => {
        var _a;
        return (_a = props.onHsvChange) == null ? void 0 : _a.call(props, {
          h: hsv.value.h,
          s,
          v
        });
      }
    }, null), vue.createVNode("div", {
      "class": `${prefixCls}-panel-control`
    }, [vue.createVNode("div", {
      "class": `${prefixCls}-control-wrapper`
    }, [vue.createVNode("div", null, [vue.createVNode(controlBar, {
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
    }, null), !props.disabledAlpha && vue.createVNode(controlBar, {
      "type": "alpha",
      "x": props.alpha,
      "color": props.color,
      "colorString": props.colorString,
      "onChange": props.onAlphaChange
    }, null)]), vue.createVNode("div", {
      "class": `${prefixCls}-preview`,
      "style": {
        backgroundColor: props.colorString
      }
    }, null)]), vue.createVNode("div", {
      "class": `${prefixCls}-input-wrapper`
    }, [vue.createVNode(index$1["default"], {
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
    }, null), vue.createVNode("div", {
      "class": `${prefixCls}-group-wrapper`
    }, [renderInput()])])]), renderColorSec()]);
  }
});
module.exports = Panel;
