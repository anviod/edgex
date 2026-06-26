"use strict";
var vue = require("vue");
var ResizeObserver$1 = require("resize-observer-polyfill");
var vueUtils = require("../_utils/vue-utils.js");
var is = require("../_utils/is.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var ResizeObserver__default = /* @__PURE__ */ _interopDefaultLegacy(ResizeObserver$1);
var ResizeObserver = vue.defineComponent({
  name: "ResizeObserver",
  emits: [
    "resize"
  ],
  setup(props, {
    emit,
    slots
  }) {
    let resizeObserver;
    const componentRef = vue.ref();
    const element = vue.computed(() => is.isComponentInstance(componentRef.value) ? componentRef.value.$el : componentRef.value);
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
    vue.watch(element, (_element) => {
      if (resizeObserver)
        destroyResizeObserver();
      if (_element)
        createResizeObserver(_element);
    });
    vue.onMounted(() => {
      if (element.value) {
        createResizeObserver(element.value);
      }
    });
    vue.onUnmounted(() => {
      destroyResizeObserver();
    });
    return () => {
      var _a, _b;
      const firstChild = vueUtils.getFirstComponent((_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : []);
      if (firstChild) {
        return vue.cloneVNode(firstChild, {
          ref: componentRef
        }, true);
      }
      return null;
    };
  }
});
module.exports = ResizeObserver;
