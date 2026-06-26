import { defineComponent, toRefs, watch, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { hexToRgb, rgbToHsv } from "../_utils/color.js";
import useState from "../_hooks/use-state.js";
import Input from "../input/index.js";
import InputAlpha from "./input-alpha.js";
import InputGroup from "../input/input-group.js";
var InputHex = defineComponent({
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
    const prefixCls = getPrefixCls("color-picker");
    const {
      color
    } = toRefs(props);
    const [hex, setHex] = useState(color.value.hex);
    const handlerChange = (value) => {
      var _a;
      const _rgb = hexToRgb(value) || {
        r: 255,
        g: 0,
        b: 0
      };
      const hsv = rgbToHsv(_rgb.r, _rgb.g, _rgb.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, hsv);
    };
    const onInputChange = (value) => {
      var _a, _b;
      const matchValue = (_b = (_a = value.match(/[a-fA-F0-9]*/g)) == null ? void 0 : _a.join("")) != null ? _b : "";
      if (matchValue !== color.value.hex) {
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
    watch(color, () => {
      if (color.value.hex !== hex.value) {
        setHex(color.value.hex);
      }
    });
    return () => createVNode(InputGroup, {
      "class": `${prefixCls}-input-group`
    }, {
      default: () => [createVNode(Input, {
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
      }), !props.disabledAlpha && createVNode(InputAlpha, {
        "disabled": props.disabled,
        "value": props.alpha,
        "onChange": props.onAlphaChange
      }, null)]
    });
  }
});
export { InputHex as default };
