"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var useControlBlock = require("./hooks/use-control-block.js");
var ControlBar = vue.defineComponent({
  name: "ControlBar",
  props: {
    x: {
      type: Number,
      required: true
    },
    color: {
      type: Object,
      required: true
    },
    colorString: String,
    type: String,
    onChange: Function
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("color-picker");
    const rgb = vue.computed(() => props.color.rgb);
    const {
      blockRef,
      handlerRef,
      onMouseDown
    } = useControlBlock.useControlBlock({
      value: [props.x, 0],
      onChange: (pos) => {
        var _a;
        return (_a = props.onChange) == null ? void 0 : _a.call(props, pos[0]);
      }
    });
    const renderHandler = () => {
      return vue.createVNode("div", {
        "ref": handlerRef,
        "class": `${prefixCls}-handler`,
        "style": {
          left: `${props.x * 100}%`,
          color: props.colorString
        }
      }, null);
    };
    return () => {
      if (props.type === "alpha") {
        return vue.createVNode("div", {
          "class": `${prefixCls}-control-bar-bg`
        }, [vue.createVNode("div", {
          "ref": blockRef,
          "class": [`${prefixCls}-control-bar`, `${prefixCls}-control-bar-alpha`],
          "style": {
            background: `linear-gradient(to right, rgba(0, 0, 0, 0), rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}))`
          },
          "onMousedown": onMouseDown
        }, [renderHandler()])]);
      }
      return vue.createVNode("div", {
        "ref": blockRef,
        "class": [`${prefixCls}-control-bar`, `${prefixCls}-control-bar-hue`],
        "onMousedown": onMouseDown
      }, [renderHandler()]);
    };
  }
});
module.exports = ControlBar;
