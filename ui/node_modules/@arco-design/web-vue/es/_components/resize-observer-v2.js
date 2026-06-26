import { defineComponent, watch, onBeforeUnmount } from "vue";
import ResizeObserver$1 from "resize-observer-polyfill";
import { useFirstElement } from "../_hooks/use-first-element.js";
var ResizeObserver = defineComponent({
  name: "ResizeObserver",
  props: {
    watchOnUpdated: Boolean
  },
  emits: [
    "resize"
  ],
  setup(props, { emit, slots }) {
    const { children, firstElement } = useFirstElement();
    let resizeObserver;
    const createResizeObserver = (target) => {
      if (!target)
        return;
      resizeObserver = new ResizeObserver$1((entries) => {
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
    watch(firstElement, (element) => {
      if (resizeObserver)
        destroyResizeObserver();
      if (element) {
        createResizeObserver(element);
      }
    });
    onBeforeUnmount(() => {
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
export { ResizeObserver as default };
