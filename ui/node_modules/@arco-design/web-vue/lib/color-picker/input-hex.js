"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var color = require("../_utils/color.js");
var useState = require("../_hooks/use-state.js");
var index = require("../input/index.js");
var inputAlpha = require("./input-alpha.js");
var inputGroup = require("../input/input-group.js");
var InputHex = vue.defineComponent({
  name: "InputHex",
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
    const [hex, setHex] = useState(color$1.value.hex);
    const handlerChange = (value) => {
      var _a;
      const _rgb = color.hexToRgb(value) || {
        r: 255,
        g: 0,
        b: 0
      };
      const hsv = color.rgbToHsv(_rgb.r, _rgb.g, _rgb.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, hsv);
    };
    const onInputChange = (value) => {
      var _a, _b;
      const matchValue = (_b = (_a = value.match(/[a-fA-F0-9]*/g)) == null ? void 0 : _a.join("")) != null ? _b : "";
      if (matchValue !== color$1.value.hex) {
        handlerChange(matchValue.toUpperCase());
      }
    };
    const onPaste = (ev) => {
      if (!ev.clipboardData)
        return;
      let text = ev.clipboardData.getData("Text");
      if (text.startsWith("#")) {
        text = text.slice(1);
      }
      onInputChange(text);
      ev.preventDefault();
    };
    vue.watch(color$1, () => {
      if (color$1.value.hex !== hex.value) {
        setHex(color$1.value.hex);
      }
    });
    return () => vue.createVNode(inputGroup, {
      "class": `${prefixCls}-input-group`
    }, {
      default: () => [vue.createVNode(index["default"], {
        "class": `${prefixCls}-input-hex`,
        "size": "mini",
        "maxLength": 6,
        "disabled": props.disabled,
        "modelValue": hex.value,
        "onInput": setHex,
        "onChange": onInputChange,
        "onBlur": () => handlerChange,
        "onPressEnter": () => handlerChange,
        "onPaste": onPaste
      }, {
        prefix: () => "#"
      }), !props.disabledAlpha && vue.createVNode(inputAlpha, {
        "disabled": props.disabled,
        "value": props.alpha,
        "onChange": props.onAlphaChange
      }, null)]
    });
  }
});
module.exports = InputHex;
