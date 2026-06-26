"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var base = require("./base.js");
var TypographyParagraph = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("typography");
    const component = vue.computed(() => (blockquote == null ? void 0 : blockquote.value) ? "blockquote" : "div");
    const classNames = vue.computed(() => [{
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
    return vue.createVNode(base, vue.mergeProps({
      "class": classNames
    }, this.$attrs, {
      "component": component
    }), this.$slots);
  }
});
module.exports = TypographyParagraph;
