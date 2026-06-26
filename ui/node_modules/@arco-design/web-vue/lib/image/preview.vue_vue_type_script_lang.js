"use strict";
var vue = require("vue");
var useMergeState = require("../_hooks/use-merge-state.js");
var globalConfig = require("../_utils/global-config.js");
var throttleByRaf = require("../_utils/throttle-by-raf.js");
var keyboard = require("../_utils/keyboard.js");
var dom = require("../_utils/dom.js");
var previewArrow = require("./preview-arrow.js");
var previewToolbar = require("./preview-toolbar.js");
var useImageLoadStatus = require("./hooks/use-image-load-status.js");
var useImageDrag = require("./hooks/use-image-drag.js");
var index = require("../icon/icon-loading/index.js");
var index$1 = require("../icon/icon-close/index.js");
var index$7 = require("../icon/icon-zoom-out/index.js");
var index$6 = require("../icon/icon-zoom-in/index.js");
var index$3 = require("../icon/icon-fullscreen/index.js");
var index$5 = require("../icon/icon-rotate-left/index.js");
var index$4 = require("../icon/icon-rotate-right/index.js");
var index$8 = require("../icon/icon-original-size/index.js");
var usePopupOverflowHidden = require("../_hooks/use-popup-overflow-hidden.js");
var usePopupContainer = require("../_hooks/use-popup-container.js");
var getScale = require("./utils/get-scale.js");
var index$2 = require("../locale/index.js");
var usePopupManager = require("../_hooks/use-popup-manager.js");
const ROTATE_STEP = 90;
var _sfc_main = vue.defineComponent({
  name: "ImagePreview",
  components: {
    PreviewArrow: previewArrow,
    PreviewToolbar: previewToolbar,
    IconLoading: index,
    IconClose: index$1
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
    } = index$2.useI18n();
    const {
      src,
      popupContainer,
      visible,
      defaultVisible,
      maskClosable,
      actionsLayout,
      defaultScale,
      zoomRate
    } = vue.toRefs(props);
    const refWrapper = vue.ref();
    const refImage = vue.ref();
    const prefixCls = globalConfig.getPrefixCls("image-preview");
    const [mergedVisible, setVisible] = useMergeState(defaultVisible.value, vue.reactive({
      value: visible
    }));
    const classNames = vue.computed(() => [prefixCls, {
      [`${prefixCls}-hide`]: !mergedVisible.value
    }]);
    const container = usePopupContainer(document.body, vue.reactive({
      popupContainer
    }));
    const isFixed = vue.computed(() => container.value === document.body);
    const {
      zIndex
    } = usePopupManager("dialog", {
      visible: mergedVisible
    });
    const wrapperStyles = vue.computed(() => {
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
    const rotate = vue.ref(0);
    const scale = vue.ref(defaultScale.value);
    const {
      translate,
      moving,
      resetTranslate
    } = useImageDrag(vue.reactive({
      wrapperEl: refWrapper,
      imageEl: refImage,
      visible: mergedVisible,
      scale
    }));
    const scaleValueVisible = vue.ref(false);
    let hideScaleTimer = null;
    const showScaleValue = () => {
      !scaleValueVisible.value && (scaleValueVisible.value = true);
      hideScaleTimer && clearTimeout(hideScaleTimer);
      hideScaleTimer = setTimeout(() => {
        scaleValueVisible.value = false;
      }, 1e3);
    };
    usePopupOverflowHidden(vue.reactive({
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
        case keyboard.KEYBOARD_KEY.ESC:
          props.escToClose && close();
          break;
        case keyboard.KEYBOARD_KEY.ARROW_LEFT:
          props.groupArrowProps.onPrev && props.groupArrowProps.onPrev();
          break;
        case keyboard.KEYBOARD_KEY.ARROW_RIGHT:
          props.groupArrowProps.onNext && props.groupArrowProps.onNext();
          break;
        case keyboard.KEYBOARD_KEY.ARROW_UP:
          isIncludes("zoomIn") && handleScale("zoomIn");
          break;
        case keyboard.KEYBOARD_KEY.ARROW_DOWN:
          isIncludes("zoomOut") && handleScale("zoomOut");
          break;
        case keyboard.KEYBOARD_KEY.SPACE:
          isIncludes("originalSize") && changeScale(1);
          break;
      }
    };
    const onWheel = throttleByRaf.throttleByRaf((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!props.wheelZoom)
        return;
      const delta = e.deltaY || e.deltaX;
      const action = delta > 0 ? "zoomOut" : "zoomIn";
      const newScale = getScale.getScaleByRate(scale.value, zoomRate.value, action);
      changeScale(newScale);
    });
    let globalKeyDownListener = false;
    const addGlobalKeyDownListener = () => {
      vue.nextTick(() => {
        var _a;
        (_a = refWrapper == null ? void 0 : refWrapper.value) == null ? void 0 : _a.focus();
      });
      if (props.keyboard && !globalKeyDownListener) {
        globalKeyDownListener = true;
        dom.on(container.value, "keydown", handleKeyDown);
      }
    };
    const removeGlobalKeyDownListener = () => {
      if (globalKeyDownListener) {
        globalKeyDownListener = false;
        dom.off(container.value, "keydown", handleKeyDown);
      }
    };
    vue.watch([src, mergedVisible], () => {
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
      const newScale = getScale["default"](scale.value, action);
      changeScale(newScale);
    }
    vue.onBeforeUnmount(() => {
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
      actions: vue.computed(() => [
        {
          key: "fullScreen",
          name: t("imagePreview.fullScreen"),
          content: () => vue.h(index$3),
          onClick: () => fullScreen()
        },
        {
          key: "rotateRight",
          name: t("imagePreview.rotateRight"),
          content: () => vue.h(index$4),
          onClick: () => handleRotate("clockwise")
        },
        {
          key: "rotateLeft",
          name: t("imagePreview.rotateLeft"),
          content: () => vue.h(index$5),
          onClick: () => handleRotate("counterclockwise")
        },
        {
          key: "zoomIn",
          name: t("imagePreview.zoomIn"),
          content: () => vue.h(index$6),
          onClick: () => handleScale("zoomIn"),
          disabled: scale.value === getScale.maxScale
        },
        {
          key: "zoomOut",
          name: t("imagePreview.zoomOut"),
          content: () => vue.h(index$7),
          onClick: () => handleScale("zoomOut"),
          disabled: scale.value === getScale.minScale
        },
        {
          key: "originalSize",
          name: t("imagePreview.originalSize"),
          content: () => vue.h(index$8),
          onClick: () => changeScale(1)
        }
      ])
    };
  }
});
module.exports = _sfc_main;
