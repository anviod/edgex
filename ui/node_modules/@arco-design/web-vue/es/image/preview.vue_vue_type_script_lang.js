import { defineComponent, toRefs, ref, reactive, computed, watch, onBeforeUnmount, h, nextTick } from "vue";
import useMergeState from "../_hooks/use-merge-state.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { throttleByRaf } from "../_utils/throttle-by-raf.js";
import { KEYBOARD_KEY } from "../_utils/keyboard.js";
import { on, off } from "../_utils/dom.js";
import PreviewArrow from "./preview-arrow.js";
import PreviewToolbar from "./preview-toolbar.js";
import useImageLoadStatus from "./hooks/use-image-load-status.js";
import useImageDrag from "./hooks/use-image-drag.js";
import IconLoading from "../icon/icon-loading/index.js";
import IconClose from "../icon/icon-close/index.js";
import IconZoomOut from "../icon/icon-zoom-out/index.js";
import IconZoomIn from "../icon/icon-zoom-in/index.js";
import IconFullscreen from "../icon/icon-fullscreen/index.js";
import IconRotateLeft from "../icon/icon-rotate-left/index.js";
import IconRotateRight from "../icon/icon-rotate-right/index.js";
import IconOriginalSize from "../icon/icon-original-size/index.js";
import usePopupOverflowHidden from "../_hooks/use-popup-overflow-hidden.js";
import usePopupContainer from "../_hooks/use-popup-container.js";
import getScale, { maxScale, minScale, getScaleByRate } from "./utils/get-scale.js";
import { useI18n } from "../locale/index.js";
import usePopupManager from "../_hooks/use-popup-manager.js";
const ROTATE_STEP = 90;
var _sfc_main = defineComponent({
  name: "ImagePreview",
  components: {
    PreviewArrow,
    PreviewToolbar,
    IconLoading,
    IconClose
  },
  props: {
    renderToBody: {
      type: Boolean,
      default: true
    },
    src: {
      type: String
    },
    visible: {
      type: Boolean,
      default: void 0
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    actionsLayout: {
      type: Array,
      default: () => ["fullScreen", "rotateRight", "rotateLeft", "zoomIn", "zoomOut", "originalSize"]
    },
    popupContainer: {
      type: [Object, String]
    },
    inGroup: {
      type: Boolean,
      default: false
    },
    groupArrowProps: {
      type: Object,
      default: () => ({})
    },
    escToClose: {
      type: Boolean,
      default: true
    },
    wheelZoom: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    defaultScale: {
      type: Number,
      default: 1
    },
    zoomRate: {
      type: Number,
      default: 1.1
    }
  },
  emits: [
    "close",
    "update:visible"
  ],
  setup(props, {
    emit
  }) {
    const {
      t
    } = useI18n();
    const {
      src,
      popupContainer,
      visible,
      defaultVisible,
      maskClosable,
      actionsLayout,
      defaultScale,
      zoomRate
    } = toRefs(props);
    const refWrapper = ref();
    const refImage = ref();
    const prefixCls = getPrefixCls("image-preview");
    const [mergedVisible, setVisible] = useMergeState(defaultVisible.value, reactive({
      value: visible
    }));
    const classNames = computed(() => [prefixCls, {
      [`${prefixCls}-hide`]: !mergedVisible.value
    }]);
    const container = usePopupContainer(document.body, reactive({
      popupContainer
    }));
    const isFixed = computed(() => container.value === document.body);
    const {
      zIndex
    } = usePopupManager("dialog", {
      visible: mergedVisible
    });
    const wrapperStyles = computed(() => {
      const positionStyles = isFixed.value ? {
        zIndex: zIndex.value,
        position: "fixed"
      } : {
        zIndex: "inherit",
        position: "absolute"
      };
      return {
        ...positionStyles
      };
    });
    const {
      isLoading,
      isLoaded,
      setLoadStatus
    } = useImageLoadStatus();
    const rotate = ref(0);
    const scale = ref(defaultScale.value);
    const {
      translate,
      moving,
      resetTranslate
    } = useImageDrag(reactive({
      wrapperEl: refWrapper,
      imageEl: refImage,
      visible: mergedVisible,
      scale
    }));
    const scaleValueVisible = ref(false);
    let hideScaleTimer = null;
    const showScaleValue = () => {
      !scaleValueVisible.value && (scaleValueVisible.value = true);
      hideScaleTimer && clearTimeout(hideScaleTimer);
      hideScaleTimer = setTimeout(() => {
        scaleValueVisible.value = false;
      }, 1e3);
    };
    usePopupOverflowHidden(reactive({
      container,
      hidden: mergedVisible
    }));
    function reset() {
      rotate.value = 0;
      scale.value = defaultScale.value;
      resetTranslate();
    }
    const isIncludes = (action) => actionsLayout.value.includes(action);
    const handleKeyDown = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      switch (ev.key) {
        case KEYBOARD_KEY.ESC:
          props.escToClose && close();
          break;
        case KEYBOARD_KEY.ARROW_LEFT:
          props.groupArrowProps.onPrev && props.groupArrowProps.onPrev();
          break;
        case KEYBOARD_KEY.ARROW_RIGHT:
          props.groupArrowProps.onNext && props.groupArrowProps.onNext();
          break;
        case KEYBOARD_KEY.ARROW_UP:
          isIncludes("zoomIn") && handleScale("zoomIn");
          break;
        case KEYBOARD_KEY.ARROW_DOWN:
          isIncludes("zoomOut") && handleScale("zoomOut");
          break;
        case KEYBOARD_KEY.SPACE:
          isIncludes("originalSize") && changeScale(1);
          break;
      }
    };
    const onWheel = throttleByRaf((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!props.wheelZoom)
        return;
      const delta = e.deltaY || e.deltaX;
      const action = delta > 0 ? "zoomOut" : "zoomIn";
      const newScale = getScaleByRate(scale.value, zoomRate.value, action);
      changeScale(newScale);
    });
    let globalKeyDownListener = false;
    const addGlobalKeyDownListener = () => {
      nextTick(() => {
        var _a;
        (_a = refWrapper == null ? void 0 : refWrapper.value) == null ? void 0 : _a.focus();
      });
      if (props.keyboard && !globalKeyDownListener) {
        globalKeyDownListener = true;
        on(container.value, "keydown", handleKeyDown);
      }
    };
    const removeGlobalKeyDownListener = () => {
      if (globalKeyDownListener) {
        globalKeyDownListener = false;
        off(container.value, "keydown", handleKeyDown);
      }
    };
    watch([src, mergedVisible], () => {
      if (mergedVisible.value) {
        reset();
        setLoadStatus("loading");
        addGlobalKeyDownListener();
      } else {
        removeGlobalKeyDownListener();
      }
    });
    function close() {
      if (mergedVisible.value) {
        emit("close");
        emit("update:visible", false);
        setVisible(false);
      }
    }
    function onMaskClick(e) {
      var _a;
      (_a = refWrapper == null ? void 0 : refWrapper.value) == null ? void 0 : _a.focus();
      if (maskClosable.value && e.target === e.currentTarget) {
        close();
      }
    }
    function changeScale(newScale) {
      if (scale.value !== newScale) {
        scale.value = newScale;
        showScaleValue();
      }
    }
    function fullScreen() {
      const wrapperRect = refWrapper.value.getBoundingClientRect();
      const imgRect = refImage.value.getBoundingClientRect();
      const newHeightScale = wrapperRect.height / (imgRect.height / scale.value);
      const newWidthScale = wrapperRect.width / (imgRect.width / scale.value);
      const newScale = Math.max(newHeightScale, newWidthScale);
      changeScale(newScale);
    }
    function handleRotate(direction) {
      const isClockwise = direction === "clockwise";
      const newRotate = isClockwise ? (rotate.value + ROTATE_STEP) % 360 : rotate.value === 0 ? 360 - ROTATE_STEP : rotate.value - ROTATE_STEP;
      rotate.value = newRotate;
    }
    function handleScale(action) {
      const newScale = getScale(scale.value, action);
      changeScale(newScale);
    }
    onBeforeUnmount(() => {
      removeGlobalKeyDownListener();
    });
    return {
      prefixCls,
      classNames,
      container,
      wrapperStyles,
      scale,
      translate,
      rotate,
      moving,
      mergedVisible,
      isLoading,
      isLoaded,
      scaleValueVisible,
      refWrapper,
      refImage,
      onWheel,
      onMaskClick,
      onCloseClick: close,
      onImgLoad() {
        setLoadStatus("loaded");
      },
      onImgError() {
        setLoadStatus("error");
      },
      actions: computed(() => [
        {
          key: "fullScreen",
          name: t("imagePreview.fullScreen"),
          content: () => h(IconFullscreen),
          onClick: () => fullScreen()
        },
        {
          key: "rotateRight",
          name: t("imagePreview.rotateRight"),
          content: () => h(IconRotateRight),
          onClick: () => handleRotate("clockwise")
        },
        {
          key: "rotateLeft",
          name: t("imagePreview.rotateLeft"),
          content: () => h(IconRotateLeft),
          onClick: () => handleRotate("counterclockwise")
        },
        {
          key: "zoomIn",
          name: t("imagePreview.zoomIn"),
          content: () => h(IconZoomIn),
          onClick: () => handleScale("zoomIn"),
          disabled: scale.value === maxScale
        },
        {
          key: "zoomOut",
          name: t("imagePreview.zoomOut"),
          content: () => h(IconZoomOut),
          onClick: () => handleScale("zoomOut"),
          disabled: scale.value === minScale
        },
        {
          key: "originalSize",
          name: t("imagePreview.originalSize"),
          content: () => h(IconOriginalSize),
          onClick: () => changeScale(1)
        }
      ])
    };
  }
});
export { _sfc_main as default };
