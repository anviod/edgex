import { defineComponent, computed, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { hsvToRgb } from "../_utils/color.js";
import { useControlBlock } from "./hooks/use-control-block.js";
var Palette = defineComponent({
  name: "Palette",
  props: {
    color: {
      type: Object,
      required: true
    },
    onChange: Function
  },
  setup(props) {
    const prefixCls = getPrefixCls("color-picker");
    const hsv = computed(() => props.color.hsv);
    const {
      blockRef,
      handlerRef,
      onMouseDown
    } = useControlBlock({
      value: [hsv.value.s, 1 - hsv.value.v],
      onChange: (value) => {
        var _a;
        return (_a = props.onChange) == null ? void 0 : _a.call(props, value[0], 1 - value[1]);
      }
    });
    const hueColor = computed(() => {
      const rgb = hsvToRgb(hsv.value.h, 1, 1);
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    });
    return () => createVNode("div", {
      "ref": blockRef,
      "class": `${prefixCls}-palette`,
      "style": {
        backgroundColor: hueColor.value
      },
      "onMousedown": onMouseDown
    }, [createVNode("div", {
      "ref": handlerRef,
      "class": `${prefixCls}-handler`,
      "style": {
        top: `${(1 - hsv.value.v) * 100}%`,
        left: `${hsv.value.s * 100}%`
      }
    }, null)]);
  }
});
export { Palette as default };
