"use strict";
var vue = require("vue");
var resizeObserver = require("../_components/resize-observer.js");
var globalConfig = require("../_utils/global-config.js");
var throttleByRaf = require("../_utils/throttle-by-raf.js");
var is = require("../_utils/is.js");
var dom = require("../_utils/dom.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function getTargetRect(target) {
  return is.isWindow(target) ? {
    top: 0,
    bottom: window.innerHeight
  } : target.getBoundingClientRect();
}
const _sfc_main = vue.defineComponent({
  name: "Affix",
  components: {
    ResizeObserver: resizeObserver
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
    const prefixCls = globalConfig.getPrefixCls("affix");
    const { target, targetContainer } = vue.toRefs(props);
    const wrapperRef = vue.ref();
    const targetRef = vue.ref();
    const isFixed = vue.ref(false);
    const placeholderStyles = vue.ref({});
    const fixedStyles = vue.ref({});
    const classNames = vue.computed(() => ({ [prefixCls]: isFixed.value }));
    const updatePositionThrottle = throttleByRaf.throttleByRaf(() => {
      if (!wrapperRef.value || !targetRef.value)
        return;
      const { offsetTop, offsetBottom } = props;
      const offsetType = is.isUndefined(offsetBottom) ? "top" : "bottom";
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
    vue.onMounted(() => {
      vue.watchEffect((onInvalidate) => {
        const element = target && target.value !== window && dom.getElement(target.value) || window;
        targetRef.value = element;
        if (element) {
          dom.on(element, "scroll", updatePositionThrottle);
          dom.on(element, "resize", updatePositionThrottle);
          onInvalidate(() => {
            dom.off(element, "scroll", updatePositionThrottle);
            dom.off(element, "resize", updatePositionThrottle);
          });
        }
      });
      vue.watchEffect((onInvalidate) => {
        if (!targetRef.value)
          return;
        const container = targetContainer && targetContainer.value !== window && dom.getElement(targetContainer.value) || window;
        if (container) {
          dom.on(container, "scroll", updatePositionThrottle);
          dom.on(container, "resize", updatePositionThrottle);
          onInvalidate(() => {
            dom.off(container, "scroll", updatePositionThrottle);
            dom.off(container, "resize", updatePositionThrottle);
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
  const _component_ResizeObserver = vue.resolveComponent("ResizeObserver");
  return vue.openBlock(), vue.createBlock(_component_ResizeObserver, { onResize: _ctx.updatePositionThrottle }, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", _hoisted_1, [
        _ctx.isFixed ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          style: vue.normalizeStyle(_ctx.placeholderStyles)
        }, null, 4)) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(_ctx.classNames),
          style: vue.normalizeStyle(_ctx.fixedStyles)
        }, [
          vue.createVNode(_component_ResizeObserver, { onResize: _ctx.updatePositionThrottle }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["onResize"])
        ], 6)
      ], 512)
    ]),
    _: 3
  }, 8, ["onResize"]);
}
var _Affix = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Affix;
