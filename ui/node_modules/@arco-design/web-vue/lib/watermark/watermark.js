"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var useMutationObserver = require("./hooks/use-mutation-observer.js");
var useTheme = require("./hooks/use-theme.js");
var index = require("./utils/index.js");
var is = require("../_utils/is.js");
var _Watermark = vue.defineComponent({
  name: "Watermark",
  props: {
    content: {
      type: [String, Array]
    },
    image: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    gap: {
      type: Array,
      default: () => [90, 90]
    },
    offset: {
      type: Array
    },
    rotate: {
      type: Number,
      default: -22
    },
    font: {
      type: Object
    },
    zIndex: {
      type: Number,
      default: 6
    },
    alpha: {
      type: Number,
      default: 1
    },
    antiTamper: {
      type: Boolean,
      default: true
    },
    grayscale: {
      type: Boolean,
      default: false
    },
    repeat: {
      type: Boolean,
      default: true
    },
    staggered: {
      type: Boolean,
      default: true
    }
  },
  setup(props, {
    slots,
    attrs
  }) {
    const {
      width,
      height,
      image,
      rotate,
      alpha,
      repeat,
      grayscale
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("watermark");
    const ratio = window.devicePixelRatio || 1;
    const containerRef = vue.shallowRef();
    const watermarkMap = vue.ref(/* @__PURE__ */ new Map());
    const fontSize = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.fontSize) != null ? _b : 16;
    });
    const fontWeight = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.fontWeight) != null ? _b : "normal";
    });
    const fontStyle = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.fontStyle) != null ? _b : "normal";
    });
    const fontFamily = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.fontFamily) != null ? _b : "sans-serif";
    });
    const textAlign = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.textAlign) != null ? _b : "center";
    });
    const contents = vue.computed(() => is.isArray(props.content) ? props.content : [props.content]);
    const color = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) == null ? void 0 : _a.color) != null ? _b : theme.value === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";
    });
    const gapX = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.gap) == null ? void 0 : _a[0]) != null ? _b : 90;
    });
    const gapY = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.gap) == null ? void 0 : _a[1]) != null ? _b : 90;
    });
    const gapXCenter = vue.computed(() => gapX.value / 2);
    const gapYCenter = vue.computed(() => gapY.value / 2);
    const offsetLeft = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.offset) == null ? void 0 : _a[0]) != null ? _b : gapXCenter.value;
    });
    const offsetTop = vue.computed(() => {
      var _a, _b;
      return (_b = (_a = props.offset) == null ? void 0 : _a[1]) != null ? _b : gapYCenter.value;
    });
    const markStyle = vue.computed(() => {
      var _a;
      const left = offsetLeft.value - gapXCenter.value;
      const top = offsetTop.value - gapYCenter.value;
      return {
        position: "absolute",
        left: left > 0 ? `${left}px` : 0,
        top: top > 0 ? `${top}px` : 0,
        width: left > 0 ? `calc(100% - ${left}px)` : "100%",
        height: top > 0 ? `calc(100% - ${top}px)` : "100%",
        pointerEvents: "none",
        backgroundRepeat: props.repeat ? "repeat" : "no-repeat",
        backgroundPosition: `${left > 0 ? 0 : left}px ${top > 0 ? 0 : top}px`,
        zIndex: (_a = props.zIndex) != null ? _a : 6
      };
    });
    const isStaggered = vue.computed(() => props.repeat && props.staggered);
    const appendWatermark = (base64, width2) => {
      var _a;
      if (containerRef.value) {
        const watermarkEle = watermarkMap.value.get(containerRef.value);
        if (watermarkEle) {
          if (containerRef.value.contains(watermarkEle)) {
            containerRef.value.removeChild(watermarkEle);
          }
          watermarkMap.value.delete(containerRef.value);
        }
        const newWatermarkEle = document.createElement("div");
        newWatermarkEle.setAttribute("style", index.styleToString({
          ...markStyle.value,
          backgroundImage: `url('${base64}')`,
          backgroundSize: `${width2}px`
        }));
        (_a = containerRef.value) == null ? void 0 : _a.append(newWatermarkEle);
        watermarkMap.value.set(containerRef.value, newWatermarkEle);
      }
    };
    const getMarkSize = (ctx) => {
      var _a, _b;
      let defaultWidth = 120;
      let defaultHeight = 28;
      if (!image.value && ctx.measureText) {
        ctx.font = `${fontSize.value}px ${fontFamily.value}`;
        const widths = contents.value.map((item) => ctx.measureText(item).width);
        defaultWidth = Math.ceil(Math.max(...widths));
        defaultHeight = fontSize.value * contents.value.length + (contents.value.length - 1) * 3;
      }
      return [(_a = width.value) != null ? _a : defaultWidth, (_b = height.value) != null ? _b : defaultHeight];
    };
    const renderWatermark = () => {
      var _a;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx)
        return;
      const [markWidth, markheight] = getMarkSize(ctx);
      const realMarkWidth = markWidth * ratio;
      const realMarkHeight = markheight * ratio;
      const canvasWidth = (gapX.value + markWidth) * ratio;
      const canvasHeight = (gapY.value + markheight) * ratio;
      const drawX = gapX.value / 2 * ratio;
      const drawY = gapY.value / 2 * ratio;
      const rotateX = canvasWidth / 2;
      const rotateY = canvasHeight / 2;
      const baseSize = isStaggered.value ? 2 : 1;
      const fillWidth = (gapX.value + markWidth) * baseSize;
      canvas.width = canvasWidth * baseSize;
      canvas.height = canvasHeight * baseSize;
      ctx.globalAlpha = alpha.value;
      ctx.save();
      ctx.translate(rotateX, rotateY);
      ctx.rotate(Math.PI / 180 * rotate.value);
      ctx.translate(-rotateX, -rotateY);
      const drawImage = () => {
        ctx.restore();
        if (isStaggered.value) {
          ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight, canvasWidth, canvasHeight, canvasWidth, canvasHeight);
        }
        grayscale.value && index.canvasToGray(canvas);
        appendWatermark(canvas.toDataURL(), fillWidth);
      };
      if (image.value) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, drawX, drawY, realMarkWidth, realMarkHeight);
          drawImage();
        };
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.src = image.value;
      } else {
        const mergedFontSize = Number(fontSize.value) * ratio;
        ctx.font = `${fontStyle.value} normal ${fontWeight.value} ${mergedFontSize}px/${markheight}px ${fontFamily.value}`;
        ctx.fillStyle = color.value;
        ctx.textAlign = textAlign.value;
        ctx.textBaseline = "top";
        ctx.translate(realMarkWidth / 2, 0);
        (_a = contents.value) == null ? void 0 : _a.forEach((item, index2) => {
          ctx.fillText(item != null ? item : "", drawX, drawY + index2 * (mergedFontSize + 3 * ratio));
        });
        drawImage();
      }
    };
    const isWatermarkEle = (ele) => Array.from(watermarkMap.value.values()).includes(ele);
    const handleMutations = (mutations) => {
      if (!props.antiTamper)
        return;
      for (const mutation of mutations) {
        const isRemoved = Array.from(mutation.removedNodes).some((node) => isWatermarkEle(node));
        const isModified = mutation.type === "attributes" && isWatermarkEle(mutation.target);
        if (isRemoved || isModified) {
          renderWatermark();
          break;
        }
      }
    };
    const {
      theme
    } = useTheme.useTheme(renderWatermark);
    vue.onMounted(() => {
      renderWatermark();
      useMutationObserver.useMutationObserver(containerRef.value, handleMutations, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    });
    vue.watch(props, renderWatermark, {
      deep: true,
      flush: "post"
    });
    return () => {
      var _a;
      return vue.createVNode("div", vue.mergeProps({
        "ref": containerRef,
        "class": prefixCls,
        "style": {
          position: "relative",
          overflow: "hidden"
        }
      }, attrs), [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
module.exports = _Watermark;
