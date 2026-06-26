"use strict";
var vue = require("vue");
var base = require("./base.js");
var TypographyTitle = vue.defineComponent({
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
    } = vue.toRefs(props);
    const component = vue.computed(() => `h${heading == null ? void 0 : heading.value}`);
    return {
      component
    };
  },
  render() {
    const {
      component
    } = this;
    return vue.createVNode(base, vue.mergeProps(this.$attrs, {
      "component": component
    }), this.$slots);
  }
});
module.exports = TypographyTitle;
