import { defineComponent, toRefs, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { rgbToHsv } from "../_utils/color.js";
import "../input/index.js";
import InputNumber from "../input-number/index.js";
import InputAlpha from "./input-alpha.js";
import InputGroup from "../input/input-group.js";
var InputRgb = defineComponent({
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
    const prefixCls = getPrefixCls("color-picker");
    const {
      color
    } = toRefs(props);
    const handleChange = (value) => {
      var _a;
      const newRGB = {
        ...color.value.rgb,
        ...value
      };
      const hsv = rgbToHsv(newRGB.r, newRGB.g, newRGB.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, hsv);
    };
    return () => createVNode(InputGroup, {
      "class": `${prefixCls}-input-group`
    }, {
      default: () => [["r", "g", "b"].map((channel) => createVNode(InputNumber, {
        "key": channel,
        "size": "mini",
        "min": 0,
        "max": 255,
        "disabled": props.disabled,
        "modelValue": color.value.rgb[channel],
        "hideButton": true,
        "onChange": (val = 0) => handleChange({
          [channel]: val
        })
      }, null)), !props.disabledAlpha && createVNode(InputAlpha, {
        "disabled": props.disabled,
        "value": props.alpha,
        "onChange": props.onAlphaChange
      }, null)]
    });
  }
});
export { InputRgb as default };
