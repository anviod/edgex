"use strict";
var vue = require("vue");
var base = require("./base.js");
var TypographyText = vue.defineComponent({
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
    } = vue.toRefs(props);
    const component = vue.computed(() => (ellipsis == null ? void 0 : ellipsis.value) ? "div" : "span");
    return {
      component
    };
  },
  render() {
    const {
      ellipsis,
      component
    } = this;
    return vue.createVNode(base, vue.mergeProps(this.$attrs, {
      "ellipsis": ellipsis,
      "component": component
    }), this.$slots);
  }
});
module.exports = TypographyText;
