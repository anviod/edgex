"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var ResizeObserver = require("resize-observer-polyfill");
var is = require("../_utils/is.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var ResizeObserver__default = /* @__PURE__ */ _interopDefaultLegacy(ResizeObserver);
const useResizeObserver = ({
  elementRef,
  onResize
}) => {
  let resizeObserver;
  const createResizeObserver = () => {
    if (!elementRef.value)
      return;
    resizeObserver = new ResizeObserver__default["default"]((entries) => {
      const entry = entries[0];
      is.isFunction(onResize) && onResize(entry);
    });
    resizeObserver.observe(elementRef.value);
  };
  const destroyResizeObserver = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };
  return {
    createResizeObserver,
    destroyResizeObserver
  };
};
exports.useResizeObserver = useResizeObserver;
