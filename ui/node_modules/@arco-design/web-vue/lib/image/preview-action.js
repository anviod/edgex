"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../tooltip/index.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var ImagePreviewAction = vue.defineComponent({
  name: "ImagePreviewAction",
  components: {
    Tooltip: index
  },
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  setup(props, {
    slots,
    attrs
  }) {
    const prefixCls = globalConfig.getPrefixCls("image-preview-toolbar-action");
    return () => {
      var _a;
      const {
        name,
        disabled
      } = props;
      const children = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (!children || !children.length)
        return null;
      const content = vue.createVNode("div", vue.mergeProps({
        "class": [`${prefixCls}`, {
          [`${prefixCls}-disabled`]: disabled
        }],
        "onMousedown": (e) => {
          e.preventDefault();
        }
      }, attrs), [vue.createVNode("span", {
        "class": `${prefixCls}-content`
      }, [children])]);
      return name ? vue.createVNode(index, {
        "class": `${prefixCls}-tooltip`,
        "content": name
      }, _isSlot(content) ? content : {
        default: () => [content]
      }) : content;
    };
  }
});
module.exports = ImagePreviewAction;
