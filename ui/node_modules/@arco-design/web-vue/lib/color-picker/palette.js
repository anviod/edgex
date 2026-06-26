"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var color = require("../_utils/color.js");
var useControlBlock = require("./hooks/use-control-block.js");
var Palette = vue.defineComponent({
  name: "Palette",
  props: {
    color: {
      type: Object,
      required: true
    },
    onChange: Function
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    const hsv = vue.computed(() => props.color.hsv);
    const {
      blockRef,
      handlerRef,
      onMouseDown
    } = useControlBlock.useControlBlock({
      value: [hsv.value.s, 1 - hsv.value.v],
      onChange: (value) => {
        var _a;
        return (_a = props.onChange) == null ? void 0 : _a.call(props, value[0], 1 - value[1]);
      }
    });
    const hueColor = vue.computed(() => {
      const rgb = color.hsvToRgb(hsv.value.h, 1, 1);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });
    return () => vue.createVNode("div", {
      "ref": blockRef,
      "class": `${prefixCls}-palette`,
      "style": {
        backgroundColor: hueColor.value
      },
      "onMousedown": onMouseDown
    }, [vue.createVNode("div", {
      "ref": handlerRef,
      "class": `${prefixCls}-handler`,
      "style": {
        top: `${(1 - hsv.value.v) * 100}%`,
        left: `${hsv.value.s * 100}%`
      }
    }, null)]);
  }
});
module.exports = Palette;
