"use strict";
var vue = require("vue");
var ResizeObserver$1 = require("resize-observer-polyfill");
var useFirstElement = require("../_hooks/use-first-element.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var ResizeObserver__default = /* @__PURE__ */ _interopDefaultLegacy(ResizeObserver$1);
var ResizeObserver = vue.defineComponent({
  name: "ResizeObserver",
  props: {
    watchOnUpdated: Boolean
  },
  emits: [
    "resize"
  ],
  setup(props, { emit, slots }) {
    const { children, firstElement } = useFirstElement.useFirstElement();
    let resizeObserver;
    const createResizeObserver = (target) => {
      if (!target)
        return;
      resizeObserver = new ResizeObserver__default["default"]((entries) => {
        const entry = entries[0];
        emit("resize", entry);
      });
      resizeObserver.observe(target);
    };
    const destroyResizeObserver = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
    vue.watch(firstElement, (element) => {
      if (resizeObserver)
        destroyResizeObserver();
      if (element) {
        createResizeObserver(element);
      }
    });
    vue.onBeforeUnmount(() => {
      if (resizeObserver)
        destroyResizeObserver();
    });
    return () => {
      var _a;
      children.value = (_a = slots.default) == null ? void 0 : _a.call(slots);
      return children.value;
    };
  }
});
module.exports = ResizeObserver;
