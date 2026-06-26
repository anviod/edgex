import { defineComponent, computed, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber, isUndefined } from "../_utils/is.js";
var _Divider = defineComponent({
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
    const prefixCls = getPrefixCls("divider");
    const isHorizontal = computed(() => props.direction === "horizontal");
    const mergedStyles = computed(() => {
      const styles = {};
      if (props.size) {
        styles[isHorizontal.value ? "border-bottom-width" : "border-left-width"] = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.type) {
        styles[isHorizontal.value ? "border-bottom-style" : "border-left-style"] = props.type;
      }
      if (!isUndefined(props.margin)) {
        const margin = isNumber(props.margin) ? `${props.margin}px` : props.margin;
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
      return createVNode("div", {
        "role": "separator",
        "class": classNames,
        "style": mergedStyles.value
      }, [children && props.direction === "horizontal" && createVNode("span", {
        "class": [`${prefixCls}-text`, `${prefixCls}-text-${props.orientation}`]
      }, [children])]);
    };
  }
});
export { _Divider as default };
