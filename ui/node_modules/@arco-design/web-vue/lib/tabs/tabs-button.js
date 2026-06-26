"use strict";
var vue = require("vue");
var iconHover = require("../_components/icon-hover.js");
var index$1 = require("../icon/icon-left/index.js");
var index = require("../icon/icon-right/index.js");
var index$3 = require("../icon/icon-up/index.js");
var index$2 = require("../icon/icon-down/index.js");
var globalConfig = require("../_utils/global-config.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var TabsButton = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("tabs-nav-button");
    const handleClick = (ev) => {
      if (!props.disabled) {
        emit("click", props.type, ev);
      }
    };
    const renderIcon = () => {
      if (props.direction === "horizontal") {
        if (props.type === "next") {
          return vue.createVNode(index, null, null);
        }
        return vue.createVNode(index$1, null, null);
      }
      if (props.type === "next") {
        return vue.createVNode(index$2, null, null);
      }
      return vue.createVNode(index$3, null, null);
    };
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-left`]: props.direction === "horizontal" && props.type === "previous",
      [`${prefixCls}-right`]: props.direction === "horizontal" && props.type === "next",
      [`${prefixCls}-up`]: props.direction === "vertical" && props.type === "previous",
      [`${prefixCls}-down`]: props.direction === "vertical" && props.type === "next"
    }]);
    return () => {
      let _slot;
      return vue.createVNode("div", {
        "class": cls.value,
        "onClick": handleClick
      }, [vue.createVNode(iconHover, {
        "disabled": props.disabled
      }, _isSlot(_slot = renderIcon()) ? _slot : {
        default: () => [_slot]
      })]);
    };
  }
});
module.exports = TabsButton;
