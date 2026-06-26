import { defineComponent, toRefs, computed, inject, ref, provide, reactive, watch, onMounted, onUpdated, onDeactivated, onBeforeUnmount, createVNode, Fragment, Teleport, mergeProps, Transition, withDirectives, vShow, nextTick } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { getScrollElements, getElementScrollRect, getPopupStyle, getTransformOrigin, getArrowStyle } from "./utils.js";
import ResizeObserver from "../_components/resize-observer-v2.js";
import { on, off } from "../_utils/dom.js";
import { isEmptyChildren, mergeFirstChild } from "../_utils/vue-utils.js";
import usePickSlots from "../_hooks/use-pick-slots.js";
import { triggerInjectionKey } from "./context.js";
import { throttleByRaf } from "../_utils/throttle-by-raf.js";
import usePopupManager from "../_hooks/use-popup-manager.js";
import { useResizeObserver } from "../_hooks/use-resize-observer.js";
import ClientOnly from "../_components/client-only.js";
import { useTeleportContainer } from "../_hooks/use-teleport-container.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import { useFirstElement } from "../_hooks/use-first-element.js";
import { omit } from "../_utils/omit.js";
const TRIGGER_EVENTS = ["onClick", "onMouseenter", "onMouseleave", "onFocusin", "onFocusout", "onContextmenu"];
var _Trigger = defineComponent({
  name: "Trigger",
  inheritAttrs: false,
  props: {
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: [String, Array],
      default: "hover"
    },
    position: {
      type: String,
      default: "bottom"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    popupOffset: {
      type: Number,
      default: 0
    },
    popupTranslate: {
      type: [Array, Object]
    },
    showArrow: {
      type: Boolean,
      default: false
    },
    alignPoint: {
      type: Boolean,
      default: false
    },
    popupHoverStay: {
      type: Boolean,
      default: true
    },
    blurToClose: {
      type: Boolean,
      default: true
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    clickOutsideToClose: {
      type: Boolean,
      default: true
    },
    unmountOnClose: {
      type: Boolean,
      default: true
    },
    contentClass: {
      type: [String, Array, Object]
    },
    contentStyle: {
      type: Object
    },
    arrowClass: {
      type: [String, Array, Object]
    },
    arrowStyle: {
      type: Object
    },
    popupStyle: {
      type: Object
    },
    animationName: {
      type: String,
      default: "fade-in"
    },
    duration: {
      type: [Number, Object]
    },
    mouseEnterDelay: {
      type: Number,
      default: 100
    },
    mouseLeaveDelay: {
      type: Number,
      default: 100
    },
    focusDelay: {
      type: Number,
      default: 0
    },
    autoFitPopupWidth: {
      type: Boolean,
      default: false
    },
    autoFitPopupMinWidth: {
      type: Boolean,
      default: false
    },
    autoFixPosition: {
      type: Boolean,
      default: true
    },
    popupContainer: {
      type: [String, Object]
    },
    updateAtScroll: {
      type: Boolean,
      default: false
    },
    autoFitTransformOrigin: {
      type: Boolean,
      default: false
    },
    hideEmpty: {
      type: Boolean,
      default: false
    },
    openedClass: {
      type: [String, Array, Object]
    },
    autoFitPosition: {
      type: Boolean,
      default: true
    },
    renderToBody: {
      type: Boolean,
      default: true
    },
    preventFocus: {
      type: Boolean,
      default: false
    },
    scrollToClose: {
      type: Boolean,
      default: false
    },
    scrollToCloseDistance: {
      type: Number,
      default: 0
    }
  },
  emits: {
    "update:popupVisible": (visible) => true,
    "popupVisibleChange": (visible) => true,
    "show": () => true,
    "hide": () => true,
    "resize": () => true
  },
  setup(props, {
    emit,
    slots,
    attrs
  }) {
    const {
      popupContainer
    } = toRefs(props);
    const prefixCls = getPrefixCls("trigger");
    const popupAttrs = computed(() => omit(attrs, TRIGGER_EVENTS));
    const configCtx = inject(configProviderInjectionKey, void 0);
    const triggerMethods = computed(() => [].concat(props.trigger));
    const childrenRefs = /* @__PURE__ */ new Set();
    const triggerCtx = inject(triggerInjectionKey, void 0);
    const {
      children,
      firstElement
    } = useFirstElement();
    const popupRef = ref();
    const popupVisible = ref(props.defaultPopupVisible);
    const popupPosition = ref(props.position);
    const popupStyle = ref({});
    const transformStyle = ref({});
    const arrowStyle = ref({});
    const arrowRef = ref();
    const mousePosition = ref({
      top: 0,
      left: 0
    });
    let scrollPosition = null;
    let windowScrollPosition = null;
    const computedVisible = computed(() => {
      var _a;
      return (_a = props.popupVisible) != null ? _a : popupVisible.value;
    });
    const {
      teleportContainer,
      containerRef
    } = useTeleportContainer({
      popupContainer,
      visible: computedVisible,
      documentContainer: true
    });
    const {
      zIndex
    } = usePopupManager("popup", {
      visible: computedVisible
    });
    let delayTimer = 0;
    let outsideListener = false;
    let windowListener = false;
    const cleanDelayTimer = () => {
      if (delayTimer) {
        window.clearTimeout(delayTimer);
        delayTimer = 0;
      }
    };
    const updateMousePosition = (e) => {
      if (props.alignPoint) {
        const {
          pageX,
          pageY
        } = e;
        mousePosition.value = {
          top: pageY,
          left: pageX
        };
      }
    };
    const updatePopupStyle = () => {
      if (!firstElement.value || !popupRef.value || !containerRef.value) {
        return;
      }
      const containerRect = containerRef.value.getBoundingClientRect();
      const triggerRect = props.alignPoint ? {
        top: mousePosition.value.top,
        bottom: mousePosition.value.top,
        left: mousePosition.value.left,
        right: mousePosition.value.left,
        scrollTop: mousePosition.value.top,
        scrollBottom: mousePosition.value.top,
        scrollLeft: mousePosition.value.left,
        scrollRight: mousePosition.value.left,
        width: 0,
        height: 0
      } : getElementScrollRect(firstElement.value, containerRect);
      const getPopupRect = () => getElementScrollRect(popupRef.value, containerRect);
      const popupRect = getPopupRect();
      const {
        style,
        position
      } = getPopupStyle(props.position, containerRect, triggerRect, popupRect, {
        offset: props.popupOffset,
        translate: props.popupTranslate,
        customStyle: props.popupStyle,
        autoFitPosition: props.autoFitPosition
      });
      if (props.autoFitTransformOrigin) {
        transformStyle.value = {
          transformOrigin: getTransformOrigin(position)
        };
      }
      if (props.autoFitPopupMinWidth) {
        style.minWidth = `${triggerRect.width}px`;
      } else if (props.autoFitPopupWidth) {
        style.width = `${triggerRect.width}px`;
      }
      if (popupPosition.value !== position) {
        popupPosition.value = position;
      }
      popupStyle.value = style;
      if (props.showArrow) {
        nextTick(() => {
          arrowStyle.value = getArrowStyle(position, triggerRect, getPopupRect(), {
            customStyle: props.arrowStyle
          });
        });
      }
    };
    const changeVisible = (visible, delay) => {
      if (visible === computedVisible.value && delayTimer === 0) {
        return;
      }
      const update = () => {
        popupVisible.value = visible;
        emit("update:popupVisible", visible);
        emit("popupVisibleChange", visible);
        if (visible) {
          nextTick(() => {
            updatePopupStyle();
          });
        }
      };
      if (!visible) {
        scrollPosition = null;
        windowScrollPosition = null;
      }
      if (delay) {
        cleanDelayTimer();
        if (visible !== computedVisible.value) {
          delayTimer = window.setTimeout(update, delay);
        }
      } else {
        update();
      }
    };
    const handleClick = (e) => {
      var _a;
      (_a = attrs.onClick) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || computedVisible.value && !props.clickToClose) {
        return;
      }
      if (triggerMethods.value.includes("click")) {
        updateMousePosition(e);
        changeVisible(!computedVisible.value);
      } else if (triggerMethods.value.includes("contextMenu") && computedVisible.value) {
        changeVisible(false);
      }
    };
    const handleMouseEnter = (e) => {
      var _a;
      (_a = attrs.onMouseenter) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || !triggerMethods.value.includes("hover")) {
        return;
      }
      updateMousePosition(e);
      changeVisible(true, props.mouseEnterDelay);
    };
    const handleMouseEnterWithContext = (e) => {
      triggerCtx == null ? void 0 : triggerCtx.onMouseenter(e);
      handleMouseEnter(e);
    };
    const handleMouseLeave = (e) => {
      var _a;
      (_a = attrs.onMouseleave) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || !triggerMethods.value.includes("hover")) {
        return;
      }
      changeVisible(false, props.mouseLeaveDelay);
    };
    const handleMouseLeaveWithContext = (e) => {
      triggerCtx == null ? void 0 : triggerCtx.onMouseleave(e);
      handleMouseLeave(e);
    };
    const handleFocusin = (e) => {
      var _a;
      (_a = attrs.onFocusin) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || !triggerMethods.value.includes("focus")) {
        return;
      }
      changeVisible(true, props.focusDelay);
    };
    const handleFocusout = (e) => {
      var _a;
      (_a = attrs.onFocusout) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || !triggerMethods.value.includes("focus")) {
        return;
      }
      if (!props.blurToClose) {
        return;
      }
      changeVisible(false);
    };
    const handleContextmenu = (e) => {
      var _a;
      (_a = attrs.onContextmenu) == null ? void 0 : _a.call(attrs, e);
      if (props.disabled || !triggerMethods.value.includes("contextMenu") || computedVisible.value && !props.clickToClose) {
        return;
      }
      updateMousePosition(e);
      changeVisible(!computedVisible.value);
      e.preventDefault();
    };
    const addChildRef = (ref2) => {
      childrenRefs.add(ref2);
      triggerCtx == null ? void 0 : triggerCtx.addChildRef(ref2);
    };
    const removeChildRef = (ref2) => {
      childrenRefs.delete(ref2);
      triggerCtx == null ? void 0 : triggerCtx.removeChildRef(ref2);
    };
    provide(triggerInjectionKey, reactive({
      onMouseenter: handleMouseEnterWithContext,
      onMouseleave: handleMouseLeaveWithContext,
      addChildRef,
      removeChildRef
    }));
    const removeOutsideListener = () => {
      off(document.documentElement, "mousedown", handleOutsideClick);
      outsideListener = false;
    };
    const contentSlot = usePickSlots(slots, "content");
    const hidePopup = computed(() => {
      var _a;
      return props.hideEmpty && isEmptyChildren((_a = contentSlot.value) == null ? void 0 : _a.call(contentSlot));
    });
    const handleOutsideClick = (e) => {
      var _a, _b, _c;
      if (((_a = firstElement.value) == null ? void 0 : _a.contains(e.target)) || ((_b = popupRef.value) == null ? void 0 : _b.contains(e.target))) {
        return;
      }
      for (const item of childrenRefs) {
        if ((_c = item.value) == null ? void 0 : _c.contains(e.target)) {
          return;
        }
      }
      removeOutsideListener();
      changeVisible(false);
    };
    const isExceedThreshold = (oldPosition, element) => {
      const [scrollTop, scrollLeft] = oldPosition;
      const {
        scrollTop: newScrollTop,
        scrollLeft: newScrollLeft
      } = element;
      return Math.abs(newScrollTop - scrollTop) >= props.scrollToCloseDistance || Math.abs(newScrollLeft - scrollLeft) >= props.scrollToCloseDistance;
    };
    const handleScroll = throttleByRaf((e) => {
      if (computedVisible.value) {
        if (props.scrollToClose || (configCtx == null ? void 0 : configCtx.scrollToClose)) {
          const element = e.target;
          if (!scrollPosition) {
            scrollPosition = [element.scrollTop, element.scrollLeft];
          }
          if (isExceedThreshold(scrollPosition, element)) {
            changeVisible(false);
          } else {
            updatePopupStyle();
          }
        } else {
          updatePopupStyle();
        }
      }
    });
    const removeWindowScroll = () => {
      off(window, "scroll", onWindowScroll);
      windowListener = false;
    };
    const onWindowScroll = throttleByRaf((e) => {
      const element = e.target.documentElement;
      if (!windowScrollPosition) {
        windowScrollPosition = [element.scrollTop, element.scrollLeft];
      }
      if (isExceedThreshold(windowScrollPosition, element)) {
        changeVisible(false);
        removeWindowScroll();
      }
    });
    const handleResize = () => {
      if (computedVisible.value) {
        updatePopupStyle();
      }
    };
    const onTargetResize = () => {
      handleResize();
      emit("resize");
    };
    const handlePopupMouseDown = (e) => {
      if (props.preventFocus) {
        e.preventDefault();
      }
    };
    triggerCtx == null ? void 0 : triggerCtx.addChildRef(popupRef);
    const triggerCls = computed(() => {
      return computedVisible.value ? props.openedClass : void 0;
    });
    let scrollElements;
    watch(computedVisible, (value) => {
      if (props.clickOutsideToClose) {
        if (!value && outsideListener) {
          removeOutsideListener();
        } else if (value && !outsideListener) {
          on(document.documentElement, "mousedown", handleOutsideClick);
          outsideListener = true;
        }
      }
      if (props.scrollToClose || (configCtx == null ? void 0 : configCtx.scrollToClose)) {
        on(window, "scroll", onWindowScroll);
        windowListener = true;
      }
      if (props.updateAtScroll || (configCtx == null ? void 0 : configCtx.updateAtScroll)) {
        if (value) {
          scrollElements = getScrollElements(firstElement.value);
          for (const item of scrollElements) {
            item.addEventListener("scroll", handleScroll);
          }
        } else if (scrollElements) {
          for (const item of scrollElements) {
            item.removeEventListener("scroll", handleScroll);
          }
          scrollElements = void 0;
        }
      }
      if (value) {
        mounted.value = true;
      }
    });
    watch(() => [props.autoFitPopupWidth, props.autoFitPopupMinWidth], () => {
      if (computedVisible.value) {
        updatePopupStyle();
      }
    });
    const {
      createResizeObserver,
      destroyResizeObserver
    } = useResizeObserver({
      elementRef: containerRef,
      onResize: handleResize
    });
    onMounted(() => {
      createResizeObserver();
      if (computedVisible.value) {
        updatePopupStyle();
        if (props.clickOutsideToClose && !outsideListener) {
          on(document.documentElement, "mousedown", handleOutsideClick);
          outsideListener = true;
        }
        if (props.updateAtScroll || (configCtx == null ? void 0 : configCtx.updateAtScroll)) {
          scrollElements = getScrollElements(firstElement.value);
          for (const item of scrollElements) {
            item.addEventListener("scroll", handleScroll);
          }
        }
      }
    });
    onUpdated(() => {
      if (computedVisible.value) {
        updatePopupStyle();
      }
    });
    onDeactivated(() => {
      changeVisible(false);
    });
    onBeforeUnmount(() => {
      triggerCtx == null ? void 0 : triggerCtx.removeChildRef(popupRef);
      destroyResizeObserver();
      if (outsideListener) {
        removeOutsideListener();
      }
      if (windowListener) {
        removeWindowScroll();
      }
      if (scrollElements) {
        for (const item of scrollElements) {
          item.removeEventListener("scroll", handleScroll);
        }
        scrollElements = void 0;
      }
    });
    const mounted = ref(computedVisible.value);
    const isAnimation = ref(false);
    const onAnimationStart = () => {
      isAnimation.value = true;
    };
    const handleShow = () => {
      isAnimation.value = false;
      if (computedVisible.value) {
        emit("show");
      }
    };
    const handleHide = () => {
      isAnimation.value = false;
      if (!computedVisible.value) {
        mounted.value = false;
        emit("hide");
      }
    };
    return () => {
      var _a, _b;
      children.value = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : [];
      mergeFirstChild(children.value, {
        class: triggerCls.value,
        onClick: handleClick,
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave,
        onFocusin: handleFocusin,
        onFocusout: handleFocusout,
        onContextmenu: handleContextmenu
      });
      return createVNode(Fragment, null, [props.autoFixPosition ? createVNode(ResizeObserver, {
        "onResize": onTargetResize
      }, {
        default: () => [children.value]
      }) : children.value, createVNode(ClientOnly, null, {
        default: () => [createVNode(Teleport, {
          "to": teleportContainer.value,
          "disabled": !props.renderToBody
        }, {
          default: () => [(!props.unmountOnClose || computedVisible.value || mounted.value) && !hidePopup.value && createVNode(ResizeObserver, {
            "onResize": handleResize
          }, {
            default: () => [createVNode("div", mergeProps({
              "ref": popupRef,
              "class": [`${prefixCls}-popup`, `${prefixCls}-position-${popupPosition.value}`],
              "style": {
                ...popupStyle.value,
                zIndex: zIndex.value,
                pointerEvents: isAnimation.value ? "none" : "auto"
              },
              "trigger-placement": popupPosition.value,
              "onMouseenter": handleMouseEnterWithContext,
              "onMouseleave": handleMouseLeaveWithContext,
              "onMousedown": handlePopupMouseDown
            }, popupAttrs.value), [createVNode(Transition, {
              "name": props.animationName,
              "duration": props.duration,
              "appear": true,
              "onBeforeEnter": onAnimationStart,
              "onAfterEnter": handleShow,
              "onBeforeLeave": onAnimationStart,
              "onAfterLeave": handleHide
            }, {
              default: () => {
                var _a2;
                return [withDirectives(createVNode("div", {
                  "class": `${prefixCls}-popup-wrapper`,
                  "style": transformStyle.value
                }, [createVNode("div", {
                  "class": [`${prefixCls}-content`, props.contentClass],
                  "style": props.contentStyle
                }, [(_a2 = slots.content) == null ? void 0 : _a2.call(slots)]), props.showArrow && createVNode("div", {
                  "ref": arrowRef,
                  "class": [`${prefixCls}-arrow`, props.arrowClass],
                  "style": arrowStyle.value
                }, null)]), [[vShow, computedVisible.value]])];
              }
            })])]
          })]
        })]
      })]);
    };
  }
});
export { _Trigger as default };
