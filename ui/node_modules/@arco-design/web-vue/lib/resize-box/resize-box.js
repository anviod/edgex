"use strict";
var vue = require("vue");
var resizeTrigger = require("../_components/resize-trigger.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var dom = require("../_utils/dom.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const DIRECTION_LEFT = "left";
const DIRECTION_RIGHT = "right";
const DIRECTION_TOP = "top";
const DIRECTION_BOTTOM = "bottom";
const allDirections = [
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_TOP,
  DIRECTION_BOTTOM
];
function getRealSize(pageSize, padding) {
  if (pageSize === 0)
    return 0;
  const res = pageSize - padding;
  return res <= 0 ? 0 : res;
}
function isHorizontal(direction) {
  return [DIRECTION_TOP, DIRECTION_BOTTOM].indexOf(direction) > -1;
}
const _sfc_main = vue.defineComponent({
  name: "ResizeBox",
  components: {
    ResizeTrigger: resizeTrigger
  },
  inheritAttrs: false,
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    component: {
      type: String,
      default: "div"
    },
    directions: {
      type: Array,
      default: () => ["right"]
    }
  },
  emits: {
    "update:width": (width) => true,
    "update:height": (height) => true,
    "movingStart": (ev) => true,
    "moving": (size, ev) => true,
    "movingEnd": (ev) => true
  },
  setup(props, { emit }) {
    const { height: propHeight, width: propWidth, directions } = vue.toRefs(props);
    const [width, setWidth] = useMergeState(
      null,
      vue.reactive({
        value: propWidth
      })
    );
    const [height, setHeight] = useMergeState(
      null,
      vue.reactive({
        value: propHeight
      })
    );
    const wrapperRef = vue.ref();
    const paddingStyles = vue.reactive({});
    const prefixCls = globalConfig.getPrefixCls("resizebox");
    const classNames = vue.computed(() => [prefixCls]);
    const styles = vue.computed(() => {
      return {
        ...is.isNumber(width.value) ? { width: `${width.value}px` } : {},
        ...is.isNumber(height.value) ? { height: `${height.value}px` } : {},
        ...paddingStyles
      };
    });
    const allowDirections = vue.computed(
      () => directions.value.filter((direction) => allDirections.includes(direction))
    );
    const record = {
      direction: "",
      startPageX: 0,
      startPageY: 0,
      startWidth: 0,
      startHeight: 0,
      moving: false,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    };
    function onMoving(e) {
      if (!record.moving)
        return;
      const { startPageX, startPageY, startWidth, startHeight, direction } = record;
      let newWidth = startWidth;
      let newHeight = startHeight;
      const offsetX = e.pageX - startPageX;
      const offsetY = e.pageY - startPageY;
      switch (direction) {
        case DIRECTION_LEFT:
          newWidth = startWidth - offsetX;
          setWidth(newWidth);
          emit("update:width", newWidth);
          break;
        case DIRECTION_RIGHT:
          newWidth = startWidth + offsetX;
          setWidth(newWidth);
          emit("update:width", newWidth);
          break;
        case DIRECTION_TOP:
          newHeight = startHeight - offsetY;
          setHeight(newHeight);
          emit("update:height", newHeight);
          break;
        case DIRECTION_BOTTOM:
          newHeight = startHeight + offsetY;
          setHeight(newHeight);
          emit("update:height", newHeight);
          break;
      }
      emit(
        "moving",
        {
          width: newWidth,
          height: newHeight
        },
        e
      );
    }
    function onMoveEnd(e) {
      record.moving = false;
      dom.off(window, "mousemove", onMoving);
      dom.off(window, "mouseup", onMoveEnd);
      dom.off(window, "contextmenu", onMoveEnd);
      document.body.style.cursor = "default";
      emit("movingEnd", e);
    }
    function onMoveStart(direction, e) {
      var _a, _b;
      emit("movingStart", e);
      record.moving = true;
      record.startPageX = e.pageX;
      record.startPageY = e.pageY;
      record.direction = direction;
      const { top, left, right, bottom } = record.padding;
      record.startWidth = getRealSize(
        ((_a = wrapperRef.value) == null ? void 0 : _a.clientWidth) || 0,
        left + right
      );
      record.startHeight = getRealSize(
        ((_b = wrapperRef.value) == null ? void 0 : _b.clientHeight) || 0,
        top + bottom
      );
      dom.on(window, "mousemove", onMoving);
      dom.on(window, "mouseup", onMoveEnd);
      dom.on(window, "contextmenu", onMoveEnd);
      document.body.style.cursor = isHorizontal(direction) ? "row-resize" : "col-resize";
    }
    function onTiggerResize(direction, entry) {
      const { width: width2, height: height2 } = entry.contentRect;
      const size = isHorizontal(direction) ? height2 : width2;
      record.padding[direction] = size;
      paddingStyles[`padding-${direction}`] = `${size}px`;
    }
    return {
      prefixCls,
      classNames,
      styles,
      wrapperRef,
      onMoveStart,
      isHorizontal,
      allowDirections,
      onTiggerResize
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeTrigger = vue.resolveComponent("ResizeTrigger");
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), vue.mergeProps({
    ref: "wrapperRef",
    class: _ctx.classNames
  }, _ctx.$attrs, { style: _ctx.styles }), {
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default"),
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.allowDirections, (direction) => {
        return vue.openBlock(), vue.createBlock(_component_ResizeTrigger, {
          key: direction,
          "prefix-cls": `${_ctx.prefixCls}-trigger`,
          class: vue.normalizeClass(`${_ctx.prefixCls}-direction-${direction}`),
          direction: _ctx.isHorizontal(direction) ? "horizontal" : "vertical",
          onMousedown: (e) => {
            _ctx.onMoveStart(direction, e);
          },
          onResize: (entry) => {
            _ctx.onTiggerResize(direction, entry);
          }
        }, vue.createSlots({
          default: vue.withCtx(() => [
            _ctx.$slots["resize-trigger"] ? vue.renderSlot(_ctx.$slots, "resize-trigger", {
              key: 0,
              direction
            }) : vue.createCommentVNode("v-if", true)
          ]),
          _: 2
        }, [
          _ctx.$slots["resize-trigger-icon"] ? {
            name: "icon",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "resize-trigger-icon", { direction })
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["prefix-cls", "class", "direction", "onMousedown", "onResize"]);
      }), 128))
    ]),
    _: 3
  }, 16, ["class", "style"]);
}
var _ResizeBox = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _ResizeBox;
