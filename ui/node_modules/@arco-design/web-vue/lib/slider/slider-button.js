"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../tooltip/index.js");
var dom = require("../_utils/dom.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SliderButton",
  components: {
    Tooltip: index
  },
  inheritAttrs: false,
  props: {
    direction: {
      type: String,
      default: "horizontal"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    formatTooltip: {
      type: Function
    },
    value: [String, Number],
    tooltipPosition: {
      type: String
    },
    showTooltip: {
      type: Boolean,
      default: true
    }
  },
  emits: ["movestart", "moving", "moveend"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("slider-btn");
    const isDragging = vue.ref(false);
    const handleMouseDown = (e) => {
      if (props.disabled) {
        return;
      }
      e.preventDefault();
      isDragging.value = true;
      dom.on(window, "mousemove", handleMouseMove);
      dom.on(window, "touchmove", handleMouseMove);
      dom.on(window, "mouseup", handleMouseUp);
      dom.on(window, "contextmenu", handleMouseUp);
      dom.on(window, "touchend", handleMouseUp);
      emit("movestart");
    };
    const handleMouseMove = (e) => {
      let clientX;
      let clientY;
      if (e.type.startsWith("touch")) {
        clientY = e.touches[0].clientY;
        clientX = e.touches[0].clientX;
      } else {
        clientY = e.clientY;
        clientX = e.clientX;
      }
      emit("moving", clientX, clientY);
    };
    const handleMouseUp = () => {
      isDragging.value = false;
      dom.off(window, "mousemove", handleMouseMove);
      dom.off(window, "mouseup", handleMouseUp);
      dom.off(window, "touchend", handleMouseUp);
      emit("moveend");
    };
    const cls = vue.computed(() => [prefixCls]);
    const mergedTooltipPosition = vue.computed(
      () => {
        var _a;
        return ((_a = props.tooltipPosition) != null ? _a : props.direction === "vertical") ? "right" : "top";
      }
    );
    const tooltipContent = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.formatTooltip) == null ? void 0 : _a.call(props, props.value)) != null ? _b : `${props.value}`;
      }
    );
    const popupVisible = vue.computed(
      () => props.showTooltip ? isDragging.value ? true : void 0 : false
    );
    return {
      prefixCls,
      cls,
      tooltipContent,
      mergedTooltipPosition,
      popupVisible,
      handleMouseDown
    };
  }
});
const _hoisted_1 = ["aria-disabled", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_tooltip = vue.resolveComponent("tooltip");
  return vue.openBlock(), vue.createBlock(_component_tooltip, {
    "popup-visible": _ctx.popupVisible,
    position: _ctx.mergedTooltipPosition,
    content: _ctx.tooltipContent
  }, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", vue.mergeProps(_ctx.$attrs, {
        tabindex: "0",
        role: "slider",
        "aria-disabled": _ctx.disabled,
        "aria-valuemax": _ctx.max,
        "aria-valuemin": _ctx.min,
        "aria-valuenow": _ctx.value,
        "aria-valuetext": _ctx.tooltipContent,
        class: _ctx.cls,
        onMousedown: _cache[0] || (_cache[0] = (...args) => _ctx.handleMouseDown && _ctx.handleMouseDown(...args)),
        onTouchstart: _cache[1] || (_cache[1] = (...args) => _ctx.handleMouseDown && _ctx.handleMouseDown(...args)),
        onContextmenu: _cache[2] || (_cache[2] = vue.withModifiers(() => {
        }, ["prevent"])),
        onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
        }, ["stop"]))
      }), null, 16, _hoisted_1)
    ]),
    _: 1
  }, 8, ["popup-visible", "position", "content"]);
}
var SliderButton = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SliderButton;
