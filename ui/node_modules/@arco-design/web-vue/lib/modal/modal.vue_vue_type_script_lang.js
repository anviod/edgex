"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var clientOnly = require("../_components/client-only.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../button/index.js");
var index$1 = require("../icon/icon-close/index.js");
var index$2 = require("../icon/icon-info-circle-fill/index.js");
var index$3 = require("../icon/icon-check-circle-fill/index.js");
var index$4 = require("../icon/icon-exclamation-circle-fill/index.js");
var index$5 = require("../icon/icon-close-circle-fill/index.js");
var index$6 = require("../locale/index.js");
var useOverflow = require("../_hooks/use-overflow.js");
var dom = require("../_utils/dom.js");
var usePopupManager = require("../_hooks/use-popup-manager.js");
var is = require("../_utils/is.js");
var keyboard = require("../_utils/keyboard.js");
var useDraggable = require("./hooks/use-draggable.js");
var useTeleportContainer = require("../_hooks/use-teleport-container.js");
var _sfc_main = vue.defineComponent({
  name: "Modal",
  components: {
    ClientOnly: clientOnly,
    ArcoButton: index["default"],
    IconHover: iconHover,
    IconClose: index$1,
    IconInfoCircleFill: index$2,
    IconCheckCircleFill: index$3,
    IconExclamationCircleFill: index$4,
    IconCloseCircleFill: index$5
  },
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      default: void 0
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String]
    },
    top: {
      type: [Number, String]
    },
    mask: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    titleAlign: {
      type: String,
      default: "center"
    },
    alignCenter: {
      type: Boolean,
      default: true
    },
    unmountOnClose: Boolean,
    maskClosable: {
      type: Boolean,
      default: true
    },
    hideCancel: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: (props) => {
        return props.notice;
      }
    },
    closable: {
      type: Boolean,
      default: true
    },
    okText: String,
    cancelText: String,
    okLoading: {
      type: Boolean,
      default: false
    },
    okButtonProps: {
      type: Object
    },
    cancelButtonProps: {
      type: Object
    },
    footer: {
      type: Boolean,
      default: true
    },
    renderToBody: {
      type: Boolean,
      default: true
    },
    popupContainer: {
      type: [String, Object],
      default: "body"
    },
    maskStyle: {
      type: Object
    },
    modalClass: {
      type: [String, Array]
    },
    modalStyle: {
      type: Object
    },
    onBeforeOk: {
      type: Function
    },
    onBeforeCancel: {
      type: Function
    },
    escToClose: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    maskAnimationName: {
      type: String,
      default: (props) => {
        if (props.fullscreen) {
          return "fade-in-standard";
        }
        return "fade-modal";
      }
    },
    modalAnimationName: {
      type: String,
      default: (props) => {
        if (props.fullscreen) {
          return "zoom-in";
        }
        return "zoom-modal";
      }
    },
    bodyClass: {
      type: [String, Array]
    },
    bodyStyle: {
      type: [String, Object, Array]
    },
    messageType: {
      type: String
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:visible": (visible) => true,
    "ok": (e) => true,
    "cancel": (e) => true,
    "open": () => true,
    "close": () => true,
    "beforeOpen": () => true,
    "beforeClose": () => true
  },
  setup(props, {
    emit
  }) {
    const {
      fullscreen,
      popupContainer,
      alignCenter
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("modal");
    const {
      t
    } = index$6.useI18n();
    const wrapperRef = vue.ref();
    const modalRef = vue.ref();
    const _visible = vue.ref(props.defaultVisible);
    const computedVisible = vue.computed(() => {
      var _a;
      return (_a = props.visible) != null ? _a : _visible.value;
    });
    const _okLoading = vue.ref(false);
    const mergedOkLoading = vue.computed(() => props.okLoading || _okLoading.value);
    const mergedDraggable = vue.computed(() => props.draggable && !props.fullscreen);
    const {
      teleportContainer,
      containerRef
    } = useTeleportContainer.useTeleportContainer({
      popupContainer,
      visible: computedVisible
    });
    const mounted = vue.ref(computedVisible.value);
    const okDisplayText = vue.computed(() => props.okText || t("modal.okText"));
    const cancelDisplayText = vue.computed(() => props.cancelText || t("modal.cancelText"));
    const {
      zIndex,
      isLastDialog
    } = usePopupManager("dialog", {
      visible: computedVisible
    });
    let globalKeyDownListener = false;
    const handleGlobalKeyDown = (ev) => {
      if (props.escToClose && ev.key === keyboard.KEYBOARD_KEY.ESC && isLastDialog()) {
        handleCancel(ev);
      }
    };
    const addGlobalKeyDownListener = () => {
      if (props.escToClose && !globalKeyDownListener) {
        globalKeyDownListener = true;
        dom.on(document.documentElement, "keydown", handleGlobalKeyDown);
      }
    };
    const removeGlobalKeyDownListener = () => {
      globalKeyDownListener = false;
      dom.off(document.documentElement, "keydown", handleGlobalKeyDown);
    };
    let promiseNumber = 0;
    const {
      position,
      handleMoveDown
    } = useDraggable.useDraggable({
      wrapperRef,
      modalRef,
      draggable: mergedDraggable,
      alignCenter
    });
    const close = () => {
      promiseNumber++;
      if (_okLoading.value) {
        _okLoading.value = false;
      }
      _visible.value = false;
      emit("update:visible", false);
    };
    const handleOk = async (e) => {
      const currentPromiseNumber = promiseNumber;
      const closed = await new Promise(
        async (resolve) => {
          var _a;
          if (is.isFunction(props.onBeforeOk)) {
            let result = props.onBeforeOk((closed2 = true) => resolve(closed2));
            if (is.isPromise(result) || !is.isBoolean(result)) {
              _okLoading.value = true;
            }
            if (is.isPromise(result)) {
              try {
                result = (_a = await result) != null ? _a : true;
              } catch (error) {
                result = false;
                throw error;
              }
            }
            if (is.isBoolean(result)) {
              resolve(result);
            }
          } else {
            resolve(true);
          }
        }
      );
      if (currentPromiseNumber === promiseNumber) {
        if (closed) {
          emit("ok", e);
          close();
        } else if (_okLoading.value) {
          _okLoading.value = false;
        }
      }
    };
    const handleCancel = (e) => {
      var _a;
      let result = true;
      if (is.isFunction(props.onBeforeCancel)) {
        result = (_a = props.onBeforeCancel()) != null ? _a : false;
      }
      if (result) {
        emit("cancel", e);
        close();
      }
    };
    const currentIsMask = vue.ref(false);
    const handleMaskMouseDown = (ev) => {
      if (ev.target === wrapperRef.value) {
        currentIsMask.value = true;
      }
    };
    const handleMaskClick = (e) => {
      if (props.mask && props.maskClosable && currentIsMask.value) {
        handleCancel(e);
      }
    };
    const handleOpen = () => {
      if (computedVisible.value) {
        if (!dom.contains(wrapperRef.value, document.activeElement) && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        emit("open");
      }
    };
    const handleClose = () => {
      if (!computedVisible.value) {
        if (mergedDraggable.value) {
          position.value = void 0;
        }
        mounted.value = false;
        resetOverflow();
        emit("close");
      }
    };
    const {
      setOverflowHidden,
      resetOverflow
    } = useOverflow.useOverflow(containerRef);
    vue.onMounted(() => {
      containerRef.value = dom.getElement(props.popupContainer);
      if (computedVisible.value) {
        setOverflowHidden();
        if (props.escToClose) {
          addGlobalKeyDownListener();
        }
      }
    });
    vue.onBeforeUnmount(() => {
      resetOverflow();
      removeGlobalKeyDownListener();
    });
    vue.watch(computedVisible, (value) => {
      if (_visible.value !== value) {
        _visible.value = value;
      }
      if (value) {
        emit("beforeOpen");
        mounted.value = true;
        currentIsMask.value = false;
        setOverflowHidden();
        addGlobalKeyDownListener();
      } else {
        emit("beforeClose");
        removeGlobalKeyDownListener();
      }
    });
    vue.watch(fullscreen, () => {
      if (position.value) {
        position.value = void 0;
      }
    });
    const wrapperCls = vue.computed(() => [`${prefixCls}-wrapper`, {
      [`${prefixCls}-wrapper-align-center`]: props.alignCenter && !props.fullscreen,
      [`${prefixCls}-wrapper-moved`]: Boolean(position.value)
    }]);
    const modalCls = vue.computed(() => [`${prefixCls}`, props.modalClass, {
      [`${prefixCls}-simple`]: props.simple,
      [`${prefixCls}-draggable`]: mergedDraggable.value,
      [`${prefixCls}-fullscreen`]: props.fullscreen
    }]);
    const mergedModalStyle = vue.computed(() => {
      var _a;
      const style = {
        ...(_a = props.modalStyle) != null ? _a : {}
      };
      if (props.width && !props.fullscreen) {
        style.width = is.isNumber(props.width) ? `${props.width}px` : props.width;
      }
      if (!props.alignCenter && props.top) {
        style.top = is.isNumber(props.top) ? `${props.top}px` : props.top;
      }
      if (position.value) {
        style.transform = `translate(${position.value[0]}px, ${position.value[1]}px)`;
      }
      return style;
    });
    return {
      prefixCls,
      mounted,
      computedVisible,
      containerRef,
      wrapperRef,
      mergedModalStyle,
      okDisplayText,
      cancelDisplayText,
      zIndex,
      handleOk,
      handleCancel,
      handleMaskClick,
      handleMaskMouseDown,
      handleOpen,
      handleClose,
      mergedOkLoading,
      modalRef,
      wrapperCls,
      modalCls,
      teleportContainer,
      handleMoveDown
    };
  }
});
module.exports = _sfc_main;
