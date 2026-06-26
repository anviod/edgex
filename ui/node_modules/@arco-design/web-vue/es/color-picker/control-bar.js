import { defineComponent, computed, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { useControlBlock } from "./hooks/use-control-block.js";
var ControlBar = defineComponent({
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
    const prefixCls = getPrefixCls("color-picker");
    const rgb = computed(() => props.color.rgb);
    const {
      blockRef,
      handlerRef,
      onMouseDown
    } = useControlBlock({
      value: [props.x, 0],
      onChange: (pos) => {
        var _a;
        return (_a = props.onChange) == null ? void 0 : _a.call(props, pos[0]);
      }
    });
    const renderHandler = () => {
      return createVNode("div", {
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
        return createVNode("div", {
          "class": `${prefixCls}-control-bar-bg`
        }, [createVNode("div", {
          "ref": blockRef,
          "class": [`${prefixCls}-control-bar`, `${prefixCls}-control-bar-alpha`],
          "style": {
            background: `linear-gradient(to right, rgba(0, 0, 0, 0), rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b}))`
          },
          "onMousedown": onMouseDown
        }, [renderHandler()])]);
      }
      return createVNode("div", {
        "ref": blockRef,
        "class": [`${prefixCls}-control-bar`, `${prefixCls}-control-bar-hue`],
        "onMousedown": onMouseDown
      }, [renderHandler()]);
    };
  }
});
export { ControlBar as default };
