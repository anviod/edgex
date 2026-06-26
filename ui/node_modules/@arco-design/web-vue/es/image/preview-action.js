import { defineComponent, createVNode, mergeProps, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Tooltip from "../tooltip/index.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var ImagePreviewAction = defineComponent({
  name: "ImagePreviewAction",
  components: {
    Tooltip
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
    const prefixCls = getPrefixCls("image-preview-toolbar-action");
    return () => {
      var _a;
      const {
        name,
        disabled
      } = props;
      const children = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (!children || !children.length)
        return null;
      const content = createVNode("div", mergeProps({
        "class": [`${prefixCls}`, {
          [`${prefixCls}-disabled`]: disabled
        }],
        "onMousedown": (e) => {
          e.preventDefault();
        }
      }, attrs), [createVNode("span", {
        "class": `${prefixCls}-content`
      }, [children])]);
      return name ? createVNode(Tooltip, {
        "class": `${prefixCls}-tooltip`,
        "content": name
      }, _isSlot(content) ? content : {
        default: () => [content]
      }) : content;
    };
  }
});
export { ImagePreviewAction as default };
