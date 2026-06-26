"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../input-number/index.js");
var InputAlpha = vue.defineComponent({
  name: "InputAlpha",
  props: {
    value: {
      type: Number,
      required: true
    },
    disabled: Boolean,
    onChange: Function
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    return () => vue.createVNode(index, {
      "class": `${prefixCls}-input-alpha`,
      "size": "mini",
      "min": 0,
      "max": 100,
      "disabled": props.disabled,
      "modelValue": Math.round(props.value * 100),
      "onChange": (a = 100) => {
        var _a;
        return (_a = props.onChange) == null ? void 0 : _a.call(props, a / 100);
      }
    }, {
      suffix: () => "%"
    });
  }
});
module.exports = InputAlpha;
