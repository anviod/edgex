import { defineComponent, computed, createVNode, isVNode } from "vue";
import IconHover from "../_components/icon-hover.js";
import IconLeft from "../icon/icon-left/index.js";
import IconRight from "../icon/icon-right/index.js";
import IconUp from "../icon/icon-up/index.js";
import IconDown from "../icon/icon-down/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var TabsButton = defineComponent({
  name: "TabsButton",
  props: {
    type: {
      type: String,
      default: "next"
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    onClick: {
      type: Function
    }
  },
  emits: ["click"],
  setup(props, {
    emit
  }) {
    const prefixCls = getPrefixCls("tabs-nav-button");
    const handleClick = (ev) => {
      if (!props.disabled) {
        emit("click", props.type, ev);
      }
    };
    const renderIcon = () => {
      if (props.direction === "horizontal") {
        if (props.type === "next") {
          return createVNode(IconRight, null, null);
        }
        return createVNode(IconLeft, null, null);
      }
      if (props.type === "next") {
        return createVNode(IconDown, null, null);
      }
      return createVNode(IconUp, null, null);
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-left`]: props.direction === "horizontal" && props.type === "previous",
      [`${prefixCls}-right`]: props.direction === "horizontal" && props.type === "next",
      [`${prefixCls}-up`]: props.direction === "vertical" && props.type === "previous",
      [`${prefixCls}-down`]: props.direction === "vertical" && props.type === "next"
    }]);
    return () => {
      let _slot;
      return createVNode("div", {
        "class": cls.value,
        "onClick": handleClick
      }, [createVNode(IconHover, {
        "disabled": props.disabled
      }, _isSlot(_slot = renderIcon()) ? _slot : {
        default: () => [_slot]
      })]);
    };
  }
});
export { TabsButton as default };
