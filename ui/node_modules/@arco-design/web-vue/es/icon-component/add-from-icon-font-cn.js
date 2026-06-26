import { defineComponent, createVNode, mergeProps, isVNode } from "vue";
import { isServerRendering } from "../_utils/dom.js";
import _Icon from "./icon.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const scriptUrlCache = [];
const addFromIconFontCn = (options) => {
  const {
    src,
    extraProps = {}
  } = options;
  if (!isServerRendering && (src == null ? void 0 : src.length) && !scriptUrlCache.includes(src)) {
    const script = document.createElement("script");
    script.setAttribute("src", src);
    script.setAttribute("data-namespace", src);
    scriptUrlCache.push(src);
    document.body.appendChild(script);
  }
  return defineComponent({
    name: "IconFont",
    props: {
      type: String,
      size: [Number, String],
      rotate: Number,
      spin: Boolean
    },
    setup(props, {
      slots
    }) {
      return () => {
        var _a;
        const children = props.type ? createVNode("use", {
          "xlink:href": `#${props.type}`
        }, null) : (_a = slots.default) == null ? void 0 : _a.call(slots);
        return createVNode(_Icon, mergeProps(props, extraProps), _isSlot(children) ? children : {
          default: () => [children]
        });
      };
    }
  });
};
export { addFromIconFontCn };
