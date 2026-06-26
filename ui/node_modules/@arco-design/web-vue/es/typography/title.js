import { defineComponent, toRefs, computed, createVNode, mergeProps } from "vue";
import Base from "./base.js";
var TypographyTitle = defineComponent({
  name: "TypographyTitle",
  inheritAttrs: false,
  props: {
    heading: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const {
      heading
    } = toRefs(props);
    const component = computed(() => `h${heading == null ? void 0 : heading.value}`);
    return {
      component
    };
  },
  render() {
    const {
      component
    } = this;
    return createVNode(Base, mergeProps(this.$attrs, {
      "component": component
    }), this.$slots);
  }
});
export { TypographyTitle as default };
