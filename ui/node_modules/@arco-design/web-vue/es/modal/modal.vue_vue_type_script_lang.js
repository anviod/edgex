import { defineComponent, toRefs, ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import ClientOnly from "../_components/client-only.js";
import IconHover from "../_components/icon-hover.js";
import Button from "../button/index.js";
import IconClose from "../icon/icon-close/index.js";
import IconInfoCircleFill from "../icon/icon-info-circle-fill/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import { useI18n } from "../locale/index.js";
import { useOverflow } from "../_hooks/use-overflow.js";
import { getElement, on, off, contains } from "../_utils/dom.js";
import usePopupManager from "../_hooks/use-popup-manager.js";
import { isNumber, isFunction, isPromise, isBoolean } from "../_utils/is.js";
import { KEYBOARD_KEY } from "../_utils/keyboard.js";
import { useDraggable } from "./hooks/use-draggable.js";
import { useTeleportContainer } from "../_hooks/use-teleport-container.js";
var _sfc_main = defineComponent({
  name: "Modal",
  components: {
    ClientOnly,
    ArcoButton: Button,
    IconHover,
    IconClose,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill
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
    } = toRefs(props);
    const prefixCls = getPrefixCls("modal");
    const {
      t
    } = useI18n();
    const wrapperRef = ref();
    const modalRef = ref();
    const _visible = ref(props.defaultVisible);
    const computedVisible = computed(() => {
      var _a;
      return (_a = props.visible) != null ? _a : _visible.value;
    });
    const _okLoading = ref(false);
    const mergedOkLoading = computed(() => props.okLoading || _okLoading.value);
    const mergedDraggable = computed(() => props.draggable && !props.fullscreen);
    const {
      teleportContainer,
      containerRef
    } = useTeleportContainer({
      popupContainer,
      visible: computedVisible
    });
    const mounted = ref(computedVisible.value);
    const okDisplayText = computed(() => props.okText || t("modal.okText"));
    const cancelDisplayText = computed(() => props.cancelText || t("modal.cancelText"));
    const {
      zIndex,
      isLastDialog
    } = usePopupManager("dialog", {
      visible: computedVisible
    });
    let globalKeyDownListener = false;
    const handleGlobalKeyDown = (ev) => {
      if (props.escToClose && ev.key === KEYBOARD_KEY.ESC && isLastDialog()) {
        handleCancel(ev);
      }
    };
    const addGlobalKeyDownListener = () => {
      if (props.escToClose && !globalKeyDownListener) {
        globalKeyDownListener = true;
        on(document.documentElement, "keydown", handleGlobalKeyDown);
      }
    };
    const removeGlobalKeyDownListener = () => {
      globalKeyDownListener = false;
      off(document.documentElement, "keydown", handleGlobalKeyDown);
    };
    let promiseNumber = 0;
    const {
      position,
      handleMoveDown
    } = useDraggable({
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
          if (isFunction(props.onBeforeOk)) {
            let result = props.onBeforeOk((closed2 = true) => resolve(closed2));
            if (isPromise(result) || !isBoolean(result)) {
              _okLoading.value = true;
            }
            if (isPromise(result)) {
              try {
                result = (_a = await result) != null ? _a : true;
              } catch (error) {
                result = false;
                throw error;
              }
            }
            if (isBoolean(result)) {
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
      if (isFunction(props.onBeforeCancel)) {
        result = (_a = props.onBeforeCancel()) != null ? _a : false;
      }
      if (result) {
        emit("cancel", e);
        close();
      }
    };
    const currentIsMask = ref(false);
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
        if (!contains(wrapperRef.value, document.activeElement) && document.activeElement instanceof HTMLElement) {
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
    } = useOverflow(containerRef);
    onMounted(() => {
      containerRef.value = getElement(props.popupContainer);
      if (computedVisible.value) {
        setOverflowHidden();
        if (props.escToClose) {
          addGlobalKeyDownListener();
        }
      }
    });
    onBeforeUnmount(() => {
      resetOverflow();
      removeGlobalKeyDownListener();
    });
    watch(computedVisible, (value) => {
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
    watch(fullscreen, () => {
      if (position.value) {
        position.value = void 0;
      }
    });
    const wrapperCls = computed(() => [`${prefixCls}-wrapper`, {
      [`${prefixCls}-wrapper-align-center`]: props.alignCenter && !props.fullscreen,
      [`${prefixCls}-wrapper-moved`]: Boolean(position.value)
    }]);
    const modalCls = computed(() => [`${prefixCls}`, props.modalClass, {
      [`${prefixCls}-simple`]: props.simple,
      [`${prefixCls}-draggable`]: mergedDraggable.value,
      [`${prefixCls}-fullscreen`]: props.fullscreen
    }]);
    const mergedModalStyle = computed(() => {
      var _a;
      const style = {
        ...(_a = props.modalStyle) != null ? _a : {}
      };
      if (props.width && !props.fullscreen) {
        style.width = isNumber(props.width) ? `${props.width}px` : props.width;
      }
      if (!props.alignCenter && props.top) {
        style.top = isNumber(props.top) ? `${props.top}px` : props.top;
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
export { _sfc_main as default };
