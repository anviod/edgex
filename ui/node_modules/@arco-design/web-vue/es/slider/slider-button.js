import { defineComponent, ref, computed, resolveComponent, openBlock, createBlock, withCtx, createElementVNode, mergeProps, withModifiers } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Tooltip from "../tooltip/index.js";
import { on, off } from "../_utils/dom.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SliderButton",
  components: {
    Tooltip
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
    const prefixCls = getPrefixCls("slider-btn");
    const isDragging = ref(false);
    const handleMouseDown = (e) => {
      if (props.disabled) {
        return;
      }
      e.preventDefault();
      isDragging.value = true;
      on(window, "mousemove", handleMouseMove);
      on(window, "touchmove", handleMouseMove);
      on(window, "mouseup", handleMouseUp);
      on(window, "contextmenu", handleMouseUp);
      on(window, "touchend", handleMouseUp);
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
      off(window, "mousemove", handleMouseMove);
      off(window, "mouseup", handleMouseUp);
      off(window, "touchend", handleMouseUp);
      emit("moveend");
    };
    const cls = computed(() => [prefixCls]);
    const mergedTooltipPosition = computed(
      () => {
        var _a;
        return ((_a = props.tooltipPosition) != null ? _a : props.direction === "vertical") ? "right" : "top";
      }
    );
    const tooltipContent = computed(
      () => {
        var _a, _b;
        return (_b = (_a = props.formatTooltip) == null ? void 0 : _a.call(props, props.value)) != null ? _b : `${props.value}`;
      }
    );
    const popupVisible = computed(
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
  const _component_tooltip = resolveComponent("tooltip");
  return openBlock(), createBlock(_component_tooltip, {
    "popup-visible": _ctx.popupVisible,
    position: _ctx.mergedTooltipPosition,
    content: _ctx.tooltipContent
  }, {
    default: withCtx(() => [
      createElementVNode("div", mergeProps(_ctx.$attrs, {
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
        onContextmenu: _cache[2] || (_cache[2] = withModifiers(() => {
        }, ["prevent"])),
        onClick: _cache[3] || (_cache[3] = withModifiers(() => {
        }, ["stop"]))
      }), null, 16, _hoisted_1)
    ]),
    _: 1
  }, 8, ["popup-visible", "position", "content"]);
}
var SliderButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SliderButton as default };
