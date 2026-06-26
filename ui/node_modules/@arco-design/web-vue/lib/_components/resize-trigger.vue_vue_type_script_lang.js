"use strict";
var vue = require("vue");
var index = require("../icon/icon-drag-dot/index.js");
var index$1 = require("../icon/icon-drag-dot-vertical/index.js");
var resizeObserver = require("./resize-observer.js");
var _sfc_main = vue.defineComponent({
  name: "ResizeTrigger",
  components: {
    ResizeObserver: resizeObserver,
    IconDragDot: index,
    IconDragDotVertical: index$1
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
    } = vue.toRefs(props);
    const isHorizontal = vue.computed(() => (direction == null ? void 0 : direction.value) === "horizontal");
    const classNames = vue.computed(() => [prefixCls.value, {
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
module.exports = _sfc_main;
