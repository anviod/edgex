"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var dom = require("../_utils/dom.js");
var icon = require("./icon.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const scriptUrlCache = [];
const addFromIconFontCn = (options) => {
  const {
    src,
    extraProps = {}
  } = options;
  if (!dom.isServerRendering && (src == null ? void 0 : src.length) && !scriptUrlCache.includes(src)) {
    const script = document.createElement("script");
    script.setAttribute("src", src);
    script.setAttribute("data-namespace", src);
    scriptUrlCache.push(src);
    document.body.appendChild(script);
  }
  return vue.defineComponent({
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
        const children = props.type ? vue.createVNode("use", {
          "xlink:href": `#${props.type}`
        }, null) : (_a = slots.default) == null ? void 0 : _a.call(slots);
        return vue.createVNode(icon, vue.mergeProps(props, extraProps), _isSlot(children) ? children : {
          default: () => [children]
        });
      };
    }
  });
};
exports.addFromIconFontCn = addFromIconFontCn;
