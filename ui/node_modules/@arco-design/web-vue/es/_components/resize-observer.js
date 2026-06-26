import { defineComponent, ref, computed, watch, onMounted, onUnmounted, cloneVNode } from "vue";
import ResizeObserver$1 from "resize-observer-polyfill";
import { getFirstComponent } from "../_utils/vue-utils.js";
import { isComponentInstance } from "../_utils/is.js";
var ResizeObserver = defineComponent({
  name: "ResizeObserver",
  emits: [
    "resize"
  ],
  setup(props, {
    emit,
    slots
  }) {
    let resizeObserver;
    const componentRef = ref();
    const element = computed(() => isComponentInstance(componentRef.value) ? componentRef.value.$el : componentRef.value);
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
    watch(element, (_element) => {
      if (resizeObserver)
        destroyResizeObserver();
      if (_element)
        createResizeObserver(_element);
    });
    onMounted(() => {
      if (element.value) {
        createResizeObserver(element.value);
      }
    });
    onUnmounted(() => {
      destroyResizeObserver();
    });
    return () => {
      var _a, _b;
      const firstChild = getFirstComponent((_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : []);
      if (firstChild) {
        return cloneVNode(firstChild, {
          ref: componentRef
        }, true);
      }
      return null;
    };
  }
});
export { ResizeObserver as default };
