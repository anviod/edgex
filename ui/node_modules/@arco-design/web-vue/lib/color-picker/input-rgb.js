"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var color = require("../_utils/color.js");
require("../input/index.js");
var index = require("../input-number/index.js");
var inputAlpha = require("./input-alpha.js");
var inputGroup = require("../input/input-group.js");
var InputRgb = vue.defineComponent({
  name: "InputRgb",
  props: {
    color: {
      type: Object,
      required: true
    },
    alpha: {
      type: Number,
      required: true
    },
    disabled: Boolean,
    disabledAlpha: Boolean,
    onHsvChange: Function,
    onAlphaChange: Function
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    const {
      color: color$1
    } = vue.toRefs(props);
    const handleChange = (value) => {
      var _a;
      const newRGB = {
        ...color$1.value.rgb,
        ...value
      };
      const hsv = color.rgbToHsv(newRGB.r, newRGB.g, newRGB.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, hsv);
    };
    return () => vue.createVNode(inputGroup, {
      "class": `${prefixCls}-input-group`
    }, {
      default: () => [["r", "g", "b"].map((channel) => vue.createVNode(index, {
        "key": channel,
        "size": "mini",
        "min": 0,
        "max": 255,
        "disabled": props.disabled,
        "modelValue": color$1.value.rgb[channel],
        "hideButton": true,
        "onChange": (val = 0) => handleChange({
          [channel]: val
        })
      }, null)), !props.disabledAlpha && vue.createVNode(inputAlpha, {
        "disabled": props.disabled,
        "value": props.alpha,
        "onChange": props.onAlphaChange
      }, null)]
    });
  }
});
module.exports = InputRgb;
