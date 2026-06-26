"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var BTween = require("b-tween");
var is = require("../_utils/is.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var BTween__default = /* @__PURE__ */ _interopDefaultLegacy(BTween);
function slide(el, top, cb) {
  const tween = new BTween__default["default"]({
    from: {
      scrollTop: el.scrollTop
    },
    to: {
      scrollTop: top
    },
    easing: "quartOut",
    duration: 300,
    onUpdate: (keys) => {
      el.scrollTop = keys.scrollTop;
    },
    onFinish: () => {
      if (is.isFunction(cb)) {
        cb();
      }
    }
  });
  tween.start();
}
exports.slide = slide;
