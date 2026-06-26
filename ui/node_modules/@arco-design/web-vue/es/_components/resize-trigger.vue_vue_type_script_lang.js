import { defineComponent, toRefs, computed } from "vue";
import IconDragDot from "../icon/icon-drag-dot/index.js";
import IconDragDotVertical from "../icon/icon-drag-dot-vertical/index.js";
import ResizeObserver from "./resize-observer.js";
var _sfc_main = defineComponent({
  name: "ResizeTrigger",
  components: {
    ResizeObserver,
    IconDragDot,
    IconDragDotVertical
  },
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    direction: {
      type: String,
      default: "horizontal"
    }
  },
  emits: ["resize"],
  setup(props, {
    emit
  }) {
    const {
      direction,
      prefixCls
    } = toRefs(props);
    const isHorizontal = computed(() => (direction == null ? void 0 : direction.value) === "horizontal");
    const classNames = computed(() => [prefixCls.value, {
      [`${prefixCls.value}-horizontal`]: isHorizontal.value,
      [`${prefixCls.value}-vertical`]: !isHorizontal.value
    }]);
    const onResize = (entry) => {
      emit("resize", entry);
    };
    return {
      classNames,
      onResize,
      isHorizontal
    };
  }
});
export { _sfc_main as default };
