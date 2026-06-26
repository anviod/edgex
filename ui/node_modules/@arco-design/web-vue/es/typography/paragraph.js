import { defineComponent, toRefs, computed, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Base from "./base.js";
var TypographyParagraph = defineComponent({
  name: "TypographyParagraph",
  inheritAttrs: false,
  props: {
    blockquote: {
      type: Boolean
    },
    spacing: {
      type: String,
      default: "default"
    }
  },
  setup(props) {
    const {
      blockquote,
      spacing
    } = toRefs(props);
    const prefixCls = getPrefixCls("typography");
    const component = computed(() => (blockquote == null ? void 0 : blockquote.value) ? "blockquote" : "div");
    const classNames = computed(() => [{
      [`${prefixCls}-spacing-close`]: (spacing == null ? void 0 : spacing.value) === "close"
    }]);
    return {
      component,
      classNames
    };
  },
  render() {
    const {
      component,
      classNames
    } = this;
    return createVNode(Base, mergeProps({
      "class": classNames
    }, this.$attrs, {
      "component": component
    }), this.$slots);
  }
});
export { TypographyParagraph as default };
