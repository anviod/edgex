import { defineComponent, toRefs, computed, createVNode, mergeProps } from "vue";
import Base from "./base.js";
var TypographyText = defineComponent({
  name: "TypographyText",
  inheritAttrs: false,
  props: {
    ellipsis: {
      type: [Boolean, Object],
      default: false
    }
  },
  setup(props) {
    const {
      ellipsis
    } = toRefs(props);
    const component = computed(() => (ellipsis == null ? void 0 : ellipsis.value) ? "div" : "span");
    return {
      component
    };
  },
  render() {
    const {
      ellipsis,
      component
    } = this;
    return createVNode(Base, mergeProps(this.$attrs, {
      "ellipsis": ellipsis,
      "component": component
    }), this.$slots);
  }
});
export { TypographyText as default };
