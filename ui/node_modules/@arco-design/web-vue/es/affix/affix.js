import { defineComponent, toRefs, ref, computed, onMounted, watchEffect, resolveComponent, openBlock, createBlock, withCtx, createElementVNode, createElementBlock, normalizeStyle, createCommentVNode, normalizeClass, createVNode, renderSlot } from "vue";
import ResizeObserver from "../_components/resize-observer.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { throttleByRaf } from "../_utils/throttle-by-raf.js";
import { isWindow, isUndefined } from "../_utils/is.js";
import { getElement, on, off } from "../_utils/dom.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function getTargetRect(target) {
  return isWindow(target) ? {
    top: 0,
    bottom: window.innerHeight
  } : target.getBoundingClientRect();
}
const _sfc_main = defineComponent({
  name: "Affix",
  components: {
    ResizeObserver
  },
  props: {
    offsetTop: {
      type: Number,
      default: 0
    },
    offsetBottom: {
      type: Number
    },
    target: {
      type: [String, Object, Function]
    },
    targetContainer: {
      type: [String, Object, Function]
    }
  },
  emits: {
    change: (fixed) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("affix");
    const { target, targetContainer } = toRefs(props);
    const wrapperRef = ref();
    const targetRef = ref();
    const isFixed = ref(false);
    const placeholderStyles = ref({});
    const fixedStyles = ref({});
    const classNames = computed(() => ({ [prefixCls]: isFixed.value }));
    const updatePositionThrottle = throttleByRaf(() => {
      if (!wrapperRef.value || !targetRef.value)
        return;
      const { offsetTop, offsetBottom } = props;
      const offsetType = isUndefined(offsetBottom) ? "top" : "bottom";
      const wrapperRect = wrapperRef.value.getBoundingClientRect();
      const targetRect = getTargetRect(targetRef.value);
      let newIsFixed = false;
      let newFixedStyles = {};
      const newPlaceholderStyles = {
        width: `${wrapperRef.value.offsetWidth}px`,
        height: `${wrapperRef.value.offsetHeight}px`
      };
      if (offsetType === "top") {
        newIsFixed = wrapperRect.top - targetRect.top < (offsetTop || 0);
        newFixedStyles = newIsFixed ? {
          position: "fixed",
          top: `${targetRect.top + (offsetTop || 0)}px`
        } : {};
      } else {
        newIsFixed = targetRect.bottom - wrapperRect.bottom < (offsetBottom || 0);
        newFixedStyles = newIsFixed ? {
          position: "fixed",
          bottom: `${window.innerHeight - targetRect.bottom + (offsetBottom || 0)}px`
        } : {};
      }
      if (newIsFixed !== isFixed.value) {
        isFixed.value = newIsFixed;
        emit("change", newIsFixed);
      }
      placeholderStyles.value = newPlaceholderStyles;
      fixedStyles.value = {
        ...newFixedStyles,
        ...newIsFixed ? newPlaceholderStyles : {}
      };
    });
    onMounted(() => {
      watchEffect((onInvalidate) => {
        const element = target && target.value !== window && getElement(target.value) || window;
        targetRef.value = element;
        if (element) {
          on(element, "scroll", updatePositionThrottle);
          on(element, "resize", updatePositionThrottle);
          onInvalidate(() => {
            off(element, "scroll", updatePositionThrottle);
            off(element, "resize", updatePositionThrottle);
          });
        }
      });
      watchEffect((onInvalidate) => {
        if (!targetRef.value)
          return;
        const container = targetContainer && targetContainer.value !== window && getElement(targetContainer.value) || window;
        if (container) {
          on(container, "scroll", updatePositionThrottle);
          on(container, "resize", updatePositionThrottle);
          onInvalidate(() => {
            off(container, "scroll", updatePositionThrottle);
            off(container, "resize", updatePositionThrottle);
          });
        }
      });
    });
    return {
      wrapperRef,
      isFixed,
      classNames,
      placeholderStyles,
      fixedStyles,
      updatePositionThrottle
    };
  },
  methods: {
    updatePosition() {
      this.updatePositionThrottle();
    }
  }
});
const _hoisted_1 = { ref: "wrapperRef" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  return openBlock(), createBlock(_component_ResizeObserver, { onResize: _ctx.updatePositionThrottle }, {
    default: withCtx(() => [
      createElementVNode("div", _hoisted_1, [
        _ctx.isFixed ? (openBlock(), createElementBlock("div", {
          key: 0,
          style: normalizeStyle(_ctx.placeholderStyles)
        }, null, 4)) : createCommentVNode("v-if", true),
        createElementVNode("div", {
          class: normalizeClass(_ctx.classNames),
          style: normalizeStyle(_ctx.fixedStyles)
        }, [
          createVNode(_component_ResizeObserver, { onResize: _ctx.updatePositionThrottle }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["onResize"])
        ], 6)
      ], 512)
    ]),
    _: 3
  }, 8, ["onResize"]);
}
var _Affix = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Affix as default };
