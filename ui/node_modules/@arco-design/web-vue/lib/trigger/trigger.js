"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var resizeObserverV2 = require("../_components/resize-observer-v2.js");
var dom = require("../_utils/dom.js");
var vueUtils = require("../_utils/vue-utils.js");
var usePickSlots = require("../_hooks/use-pick-slots.js");
var context$1 = require("./context.js");
var throttleByRaf = require("../_utils/throttle-by-raf.js");
var usePopupManager = require("../_hooks/use-popup-manager.js");
var useResizeObserver = require("../_hooks/use-resize-observer.js");
var clientOnly = require("../_components/client-only.js");
var useTeleportContainer = require("../_hooks/use-teleport-container.js");
var context = require("../config-provider/context.js");
var useFirstElement = require("../_hooks/use-first-element.js");
var omit = require("../_utils/omit.js");
const TRIGGER_EVENTS = ["onClick", "onMouseenter", "onMouseleave", "onFocusin", "onFocusout", "onContextmenu"];
var _Trigger = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("trigger");
    const popupAttrs = vue.computed(() => omit.omit(attrs, TRIGGER_EVENTS));
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const triggerMethods = vue.computed(() => [].concat(props.trigger));
    const childrenRefs = /* @__PURE__ */ new Set();
    const triggerCtx = vue.inject(context$1.triggerInjectionKey, void 0);
    const {
      children,
      firstElement
    } = useFirstElement.useFirstElement();
    const popupRef = vue.ref();
    const popupVisible = vue.ref(props.defaultPopupVisible);
    const popupPosition = vue.ref(props.position);
    const popupStyle = vue.ref({});
    const transformStyle = vue.ref({});
    const arrowStyle = vue.ref({});
    const arrowRef = vue.ref();
    const mousePosition = vue.ref({
      top: 0,
      left: 0
    });
    let scrollPosition = null;
    let windowScrollPosition = null;
    const computedVisible = vue.computed(() => {
      var _a;
      return (_a = props.popupVisible) != null ? _a : popupVisible.value;
    });
    const {
      teleportContainer,
      containerRef
    } = useTeleportContainer.useTeleportContainer({
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
      } : utils.getElementScrollRect(firstElement.value, containerRect);
      const getPopupRect = () => utils.getElementScrollRect(popupRef.value, containerRect);
      const popupRect = getPopupRect();
      const {
        style,
        position
      } = utils.getPopupStyle(props.position, containerRect, triggerRect, popupRect, {
        offset: props.popupOffset,
        translate: props.popupTranslate,
        customStyle: props.popupStyle,
        autoFitPosition: props.autoFitPosition
      });
      if (props.autoFitTransformOrigin) {
        transformStyle.value = {
          transformOrigin: utils.getTransformOrigin(position)
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
        vue.nextTick(() => {
          arrowStyle.value = utils.getArrowStyle(position, triggerRect, getPopupRect(), {
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
          vue.nextTick(() => {
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
    const addChildRef = (ref) => {
      childrenRefs.add(ref);
      triggerCtx == null ? void 0 : triggerCtx.addChildRef(ref);
    };
    const removeChildRef = (ref) => {
      childrenRefs.delete(ref);
      triggerCtx == null ? void 0 : triggerCtx.removeChildRef(ref);
    };
    vue.provide(context$1.triggerInjectionKey, vue.reactive({
      onMouseenter: handleMouseEnterWithContext,
      onMouseleave: handleMouseLeaveWithContext,
      addChildRef,
      removeChildRef
    }));
    const removeOutsideListener = () => {
      dom.off(document.documentElement, "mousedown", handleOutsideClick);
      outsideListener = false;
    };
    const contentSlot = usePickSlots(slots, "content");
    const hidePopup = vue.computed(() => {
      var _a;
      return props.hideEmpty && vueUtils.isEmptyChildren((_a = contentSlot.value) == null ? void 0 : _a.call(contentSlot));
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
    const handleScroll = throttleByRaf.throttleByRaf((e) => {
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
      dom.off(window, "scroll", onWindowScroll);
      windowListener = false;
    };
    const onWindowScroll = throttleByRaf.throttleByRaf((e) => {
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
    const triggerCls = vue.computed(() => {
      return computedVisible.value ? props.openedClass : void 0;
    });
    let scrollElements;
    vue.watch(computedVisible, (value) => {
      if (props.clickOutsideToClose) {
        if (!value && outsideListener) {
          removeOutsideListener();
        } else if (value && !outsideListener) {
          dom.on(document.documentElement, "mousedown", handleOutsideClick);
          outsideListener = true;
        }
      }
      if (props.scrollToClose || (configCtx == null ? void 0 : configCtx.scrollToClose)) {
        dom.on(window, "scroll", onWindowScroll);
        windowListener = true;
      }
      if (props.updateAtScroll || (configCtx == null ? void 0 : configCtx.updateAtScroll)) {
        if (value) {
          scrollElements = utils.getScrollElements(firstElement.value);
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
    vue.watch(() => [props.autoFitPopupWidth, props.autoFitPopupMinWidth], () => {
      if (computedVisible.value) {
        updatePopupStyle();
      }
    });
    const {
      createResizeObserver,
      destroyResizeObserver
    } = useResizeObserver.useResizeObserver({
      elementRef: containerRef,
      onResize: handleResize
    });
    vue.onMounted(() => {
      createResizeObserver();
      if (computedVisible.value) {
        updatePopupStyle();
        if (props.clickOutsideToClose && !outsideListener) {
          dom.on(document.documentElement, "mousedown", handleOutsideClick);
          outsideListener = true;
        }
        if (props.updateAtScroll || (configCtx == null ? void 0 : configCtx.updateAtScroll)) {
          scrollElements = utils.getScrollElements(firstElement.value);
          for (const item of scrollElements) {
            item.addEventListener("scroll", handleScroll);
          }
        }
      }
    });
    vue.onUpdated(() => {
      if (computedVisible.value) {
        updatePopupStyle();
      }
    });
    vue.onDeactivated(() => {
      changeVisible(false);
    });
    vue.onBeforeUnmount(() => {
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
    const mounted = vue.ref(computedVisible.value);
    const isAnimation = vue.ref(false);
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
      vueUtils.mergeFirstChild(children.value, {
        class: triggerCls.value,
        onClick: handleClick,
        onMouseenter: handleMouseEnter,
        onMouseleave: handleMouseLeave,
        onFocusin: handleFocusin,
        onFocusout: handleFocusout,
        onContextmenu: handleContextmenu
      });
      return vue.createVNode(vue.Fragment, null, [props.autoFixPosition ? vue.createVNode(resizeObserverV2, {
        "onResize": onTargetResize
      }, {
        default: () => [children.value]
      }) : children.value, vue.createVNode(clientOnly, null, {
        default: () => [vue.createVNode(vue.Teleport, {
          "to": teleportContainer.value,
          "disabled": !props.renderToBody
        }, {
          default: () => [(!props.unmountOnClose || computedVisible.value || mounted.value) && !hidePopup.value && vue.createVNode(resizeObserverV2, {
            "onResize": handleResize
          }, {
            default: () => [vue.createVNode("div", vue.mergeProps({
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
            }, popupAttrs.value), [vue.createVNode(vue.Transition, {
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
                return [vue.withDirectives(vue.createVNode("div", {
                  "class": `${prefixCls}-popup-wrapper`,
                  "style": transformStyle.value
                }, [vue.createVNode("div", {
                  "class": [`${prefixCls}-content`, props.contentClass],
                  "style": props.contentStyle
                }, [(_a2 = slots.content) == null ? void 0 : _a2.call(slots)]), props.showArrow && vue.createVNode("div", {
                  "ref": arrowRef,
                  "class": [`${prefixCls}-arrow`, props.arrowClass],
                  "style": arrowStyle.value
                }, null)]), [[vue.vShow, computedVisible.value]])];
              }
            })])]
          })]
        })]
      })]);
    };
  }
});
module.exports = _Trigger;
