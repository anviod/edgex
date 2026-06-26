import { defineComponent, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import InputNumber from "../input-number/index.js";
var InputAlpha = defineComponent({
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
    const prefixCls = getPrefixCls("color-picker");
    return () => createVNode(InputNumber, {
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
export { InputAlpha as default };
