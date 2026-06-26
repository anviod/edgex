"use strict";
var vue = require("vue");
var resizeTrigger = require("../_components/resize-trigger.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var globalConfig = require("../_utils/global-config.js");
var dom = require("../_utils/dom.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function getSizeConfig(size) {
  const numberSize = is.isString(size) ? parseFloat(size) : size;
  let unit = "";
  if (is.isNumber(size) || String(numberSize) === size) {
    unit = numberSize > 1 ? "px" : "%";
  } else {
    unit = "px";
  }
  return {
    size: numberSize,
    unit,
    isPx: unit === "px"
  };
}
function getPxSize({
  size,
  defaultSize,
  containerSize
}) {
  const config = getSizeConfig(size != null ? size : defaultSize);
  if (config.isPx) {
    return config.size;
  }
  return config.size * containerSize;
}
function px2percent(numerator, denominator) {
  return parseFloat(numerator) / parseFloat(denominator);
}
const _sfc_main = vue.defineComponent({
  name: "Split",
  components: {
    ResizeTrigger: resizeTrigger
  },
  props: {
    component: {
      type: String,
      default: "div"
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    size: {
      type: [Number, String],
      default: void 0
    },
    defaultSize: {
      type: [Number, String],
      default: 0.5
    },
    min: {
      type: [Number, String]
    },
    max: {
      type: [Number, String]
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "moveStart": (ev) => true,
    "moving": (ev) => true,
    "moveEnd": (ev) => true,
    "update:size": (size) => true
  },
  setup(props, { emit }) {
    const { direction, size: propSize, defaultSize, min, max } = vue.toRefs(props);
    const triggerSize = vue.ref(0);
    const wrapperRef = vue.ref();
    const prefixCls = globalConfig.getPrefixCls("split");
    const [size, setSize] = useMergeState(
      defaultSize.value,
      vue.reactive({
        value: propSize
      })
    );
    const sizeConfig = vue.computed(() => getSizeConfig(size.value));
    const isHorizontal = vue.computed(() => direction.value === "horizontal");
    const classNames = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-horizontal`]: isHorizontal.value,
        [`${prefixCls}-vertical`]: !isHorizontal.value
      }
    ]);
    const firstPaneStyles = vue.computed(() => {
      const { size: numberSize, unit, isPx } = sizeConfig.value;
      const baseVal = isPx ? numberSize : numberSize * 100;
      return {
        flex: `0 0 calc(${baseVal}${unit} - ${triggerSize.value / 2}px)`
      };
    });
    const record = {
      startPageX: 0,
      startPageY: 0,
      startContainerSize: 0,
      startSize: 0
    };
    async function getContainerSize() {
      const getSize = () => {
        var _a, _b;
        return isHorizontal.value ? (_a = wrapperRef.value) == null ? void 0 : _a.clientWidth : ((_b = wrapperRef.value) == null ? void 0 : _b.clientHeight) || 0;
      };
      if (!wrapperRef.value || getSize()) {
        await vue.nextTick();
      }
      return getSize();
    }
    function updateSize(newPxSize, containerSize) {
      if (!containerSize) {
        return;
      }
      const newSize = sizeConfig.value.isPx ? `${newPxSize}px` : px2percent(newPxSize, containerSize);
      if (size.value === newSize)
        return;
      setSize(newSize);
      emit("update:size", newSize);
    }
    function getLegalPxSize(size2, containerSize) {
      const pxSize = getPxSize({
        size: size2,
        containerSize
      });
      const minPxSize = getPxSize({
        size: min.value,
        defaultSize: "0px",
        containerSize
      });
      const maxPxSize = getPxSize({
        size: max.value,
        defaultSize: `${containerSize}px`,
        containerSize
      });
      let legalPxSize = pxSize;
      legalPxSize = Math.max(legalPxSize, minPxSize);
      legalPxSize = Math.min(legalPxSize, maxPxSize);
      return legalPxSize;
    }
    function getNewPxSize({
      startContainerSize,
      startSize,
      startPosition,
      endPosition
    }) {
      const startPxSize = getPxSize({
        size: startSize,
        containerSize: startContainerSize
      });
      return getLegalPxSize(
        `${startPxSize + (endPosition - startPosition)}px`,
        startContainerSize
      );
    }
    function onMoving(e) {
      emit("moving", e);
      const newPxSize = isHorizontal.value ? getNewPxSize({
        startContainerSize: record.startContainerSize,
        startSize: record.startSize,
        startPosition: record.startPageX,
        endPosition: e.pageX
      }) : getNewPxSize({
        startContainerSize: record.startContainerSize,
        startSize: record.startSize,
        startPosition: record.startPageY,
        endPosition: e.pageY
      });
      updateSize(newPxSize, record.startContainerSize);
    }
    function onMovingEnd(e) {
      dom.off(window, "mousemove", onMoving);
      dom.off(window, "mouseup", onMovingEnd);
      dom.off(window, "contextmenu", onMovingEnd);
      document.body.style.cursor = "default";
      emit("moveEnd", e);
    }
    async function onMoveStart(e) {
      emit("moveStart", e);
      record.startPageX = e.pageX;
      record.startPageY = e.pageY;
      record.startContainerSize = await getContainerSize();
      record.startSize = size.value;
      dom.on(window, "mousemove", onMoving);
      dom.on(window, "mouseup", onMovingEnd);
      dom.on(window, "contextmenu", onMovingEnd);
      document.body.style.cursor = isHorizontal.value ? "col-resize" : "row-resize";
    }
    function onTriggerResize(entry) {
      const { width, height } = entry.contentRect;
      triggerSize.value = isHorizontal.value ? width : height;
    }
    vue.onMounted(async () => {
      const containerSize = await getContainerSize();
      const fixedPxSize = getLegalPxSize(size.value, containerSize);
      updateSize(fixedPxSize, containerSize);
    });
    return {
      prefixCls,
      classNames,
      isHorizontal,
      wrapperRef,
      onMoveStart,
      onTriggerResize,
      firstPaneStyles
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeTrigger = vue.resolveComponent("ResizeTrigger");
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), {
    ref: "wrapperRef",
    class: vue.normalizeClass(_ctx.classNames)
  }, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass([`${_ctx.prefixCls}-pane`, `${_ctx.prefixCls}-pane-first`]),
        style: vue.normalizeStyle(_ctx.firstPaneStyles)
      }, [
        vue.renderSlot(_ctx.$slots, "first")
      ], 6),
      !_ctx.disabled ? (vue.openBlock(), vue.createBlock(_component_ResizeTrigger, {
        key: 0,
        "prefix-cls": `${_ctx.prefixCls}-trigger`,
        direction: _ctx.isHorizontal ? "vertical" : "horizontal",
        onMousedown: _ctx.onMoveStart,
        onResize: _ctx.onTriggerResize
      }, {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "resize-trigger")
        ]),
        icon: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "resize-trigger-icon")
        ]),
        _: 3
      }, 8, ["prefix-cls", "direction", "onMousedown", "onResize"])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("div", {
        class: vue.normalizeClass([`${_ctx.prefixCls}-pane`, `${_ctx.prefixCls}-pane-second`])
      }, [
        vue.renderSlot(_ctx.$slots, "second")
      ], 2)
    ]),
    _: 3
  }, 8, ["class"]);
}
var _Split = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Split;
