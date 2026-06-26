import { defineComponent, toRefs, ref, computed, reactive, provide, watchEffect, onBeforeUnmount, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import CarouselIndicator from "./carousel-indicator.js";
import CarouselArrow from "./carousel-arrow.js";
import { carouselInjectionKey } from "./context.js";
import { isObject, isNumber } from "../_utils/is.js";
import { useChildrenComponents } from "../_hooks/use-children-components.js";
const DEFAULT_AUTO_PLAY = {
  interval: 3e3,
  hoverToPause: true
};
function getValidIndex(i, length) {
  const indexNumber = +i;
  return typeof indexNumber === "number" && !Number.isNaN(indexNumber) ? (indexNumber + length) % length : i;
}
var _Carousel = defineComponent({
  name: "Carousel",
  props: {
    current: {
      type: Number
    },
    defaultCurrent: {
      type: Number,
      default: 1
    },
    autoPlay: {
      type: [Boolean, Object],
      default: false
    },
    moveSpeed: {
      type: Number,
      default: 500
    },
    animationName: {
      type: String,
      default: "slide"
    },
    trigger: {
      type: String,
      default: "click"
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    showArrow: {
      type: String,
      default: "always"
    },
    arrowClass: {
      type: String,
      default: ""
    },
    indicatorType: {
      type: String,
      default: "dot"
    },
    indicatorPosition: {
      type: String,
      default: "bottom"
    },
    indicatorClass: {
      type: String,
      default: ""
    },
    transitionTimingFunction: {
      type: String,
      default: "cubic-bezier(0.34, 0.69, 0.1, 1)"
    }
  },
  emits: {
    "update:current": (index) => true,
    "change": (index, prevIndex, isManual) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      current,
      animationName,
      moveSpeed,
      transitionTimingFunction
    } = toRefs(props);
    const prefixCls = getPrefixCls("carousel");
    const isPause = ref(false);
    const previousIndex = ref();
    const slideDirection = ref();
    const computedAutoPlay = computed(() => {
      if (isObject(props.autoPlay)) {
        return {
          ...DEFAULT_AUTO_PLAY,
          ...props.autoPlay
        };
      }
      return props.autoPlay ? DEFAULT_AUTO_PLAY : {};
    });
    let intervalTimer = 0;
    let animationTimer = 0;
    const {
      children,
      components
    } = useChildrenComponents("CarouselItem");
    const _index = ref(props.defaultCurrent - 1);
    const mergedIndexes = computed(() => {
      const childrenLength = components.value.length;
      const mergedIndex = isNumber(current.value) ? getValidIndex(current.value - 1, childrenLength) : _index.value;
      const prevIndex = getValidIndex(mergedIndex - 1, childrenLength);
      const nextIndex = getValidIndex(mergedIndex + 1, childrenLength);
      return {
        mergedIndex,
        mergedPrevIndex: prevIndex,
        mergedNextIndex: nextIndex
      };
    });
    const carouselContext = reactive({
      items: components,
      slideTo,
      mergedIndexes,
      previousIndex,
      animationName,
      slideDirection,
      transitionTimingFunction,
      moveSpeed
    });
    provide(carouselInjectionKey, carouselContext);
    const clearTimer = () => {
      if (intervalTimer) {
        window.clearInterval(intervalTimer);
      }
    };
    watchEffect(() => {
      var _a;
      const {
        interval
      } = computedAutoPlay.value || {};
      const {
        mergedNextIndex
      } = mergedIndexes.value;
      const shouldInterval = ((_a = components.value) == null ? void 0 : _a.length) > 1 && !isPause.value && Boolean(interval);
      clearTimer();
      if (shouldInterval) {
        intervalTimer = window.setInterval(() => {
          slideTo({
            targetIndex: mergedNextIndex
          });
        }, interval);
      }
    });
    onBeforeUnmount(() => {
      clearTimer();
    });
    function slideTo({
      targetIndex,
      isNegative = false,
      isManual = false
    }) {
      if (!animationTimer && targetIndex !== mergedIndexes.value.mergedIndex) {
        previousIndex.value = _index.value;
        _index.value = targetIndex;
        slideDirection.value = isNegative ? "negative" : "positive";
        animationTimer = window.setTimeout(() => {
          animationTimer = 0;
        }, moveSpeed.value);
        emit("update:current", _index.value + 1);
        emit("change", _index.value + 1, previousIndex.value + 1, isManual);
      }
    }
    const onPreviousClick = () => slideTo({
      targetIndex: mergedIndexes.value.mergedPrevIndex,
      isNegative: true,
      isManual: true
    });
    const onNextClick = () => slideTo({
      targetIndex: mergedIndexes.value.mergedNextIndex,
      isManual: true
    });
    const onSelect = (index) => slideTo({
      targetIndex: index,
      isNegative: index < mergedIndexes.value.mergedIndex,
      isManual: true
    });
    const eventHandlers = computed(() => {
      return computedAutoPlay.value.hoverToPause ? {
        onMouseenter: () => {
          isPause.value = true;
        },
        onMouseleave: () => {
          isPause.value = false;
        }
      } : {};
    });
    const hasIndicator = computed(() => {
      return props.indicatorType !== "never" && components.value.length > 1;
    });
    const hasArrow = computed(() => {
      return props.showArrow !== "never" && components.value.length > 1;
    });
    const cls = computed(() => {
      return [prefixCls, `${prefixCls}-indicator-position-${props.indicatorPosition}`];
    });
    const contentCls = computed(() => {
      return [`${prefixCls}-${props.animationName}`, `${prefixCls}-${props.direction}`, {
        [`${prefixCls}-negative`]: slideDirection.value === "negative"
      }];
    });
    const indicatorCls = computed(() => {
      return [`${prefixCls}-indicator-wrapper`, `${prefixCls}-indicator-wrapper-${props.indicatorPosition}`];
    });
    return () => {
      var _a;
      children.value = (_a = slots.default) == null ? void 0 : _a.call(slots);
      return createVNode("div", mergeProps({
        "class": cls.value
      }, eventHandlers.value), [createVNode("div", {
        "class": contentCls.value
      }, [children.value]), hasIndicator.value && createVNode("div", {
        "class": indicatorCls.value
      }, [createVNode(CarouselIndicator, {
        "class": props.indicatorClass,
        "type": props.indicatorType,
        "count": components.value.length,
        "activeIndex": mergedIndexes.value.mergedIndex,
        "position": props.indicatorPosition,
        "trigger": props.trigger,
        "onSelect": onSelect
      }, null)]), hasArrow.value && createVNode(CarouselArrow, {
        "class": props.arrowClass,
        "direction": props.direction,
        "showArrow": props.showArrow,
        "onPreviousClick": onPreviousClick,
        "onNextClick": onNextClick
      }, null)]);
    };
  }
});
export { _Carousel as default };
