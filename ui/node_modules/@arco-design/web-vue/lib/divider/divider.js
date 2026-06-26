"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var _Divider = vue.defineComponent({
  name: "Divider",
  props: {
    direction: {
      type: String,
      default: "horizontal"
    },
    orientation: {
      type: String,
      default: "center"
    },
    type: {
      type: String
    },
    size: {
      type: Number
    },
    margin: {
      type: [Number, String]
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("divider");
    const isHorizontal = vue.computed(() => props.direction === "horizontal");
    const mergedStyles = vue.computed(() => {
      const styles = {};
      if (props.size) {
        styles[isHorizontal.value ? "border-bottom-width" : "border-left-width"] = is.isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.type) {
        styles[isHorizontal.value ? "border-bottom-style" : "border-left-style"] = props.type;
      }
      if (!is.isUndefined(props.margin)) {
        const margin = is.isNumber(props.margin) ? `${props.margin}px` : props.margin;
        styles.margin = isHorizontal.value ? `${margin} 0` : `0 ${margin}`;
      }
      return styles;
    });
    return () => {
      var _a;
      const children = (_a = slots.default) == null ? void 0 : _a.call(slots);
      const classNames = [prefixCls, `${prefixCls}-${props.direction}`, {
        [`${prefixCls}-with-text`]: children
      }];
      return vue.createVNode("div", {
        "role": "separator",
        "class": classNames,
        "style": mergedStyles.value
      }, [children && props.direction === "horizontal" && vue.createVNode("span", {
        "class": [`${prefixCls}-text`, `${prefixCls}-text-${props.orientation}`]
      }, [children])]);
    };
  }
});
module.exports = _Divider;
