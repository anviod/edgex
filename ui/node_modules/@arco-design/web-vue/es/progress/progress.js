import { defineComponent, toRefs, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, createSlots, withCtx, renderSlot, normalizeProps, guardReactiveProps } from "vue";
import ProgressLine from "./line.js";
import ProgressCircle from "./circle.js";
import ProgressSteps from "./steps.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useSize } from "../_hooks/use-size.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Progress",
  components: {
    ProgressLine,
    ProgressCircle,
    ProgressSteps
  },
  props: {
    type: {
      type: String,
      default: "line"
    },
    size: {
      type: String
    },
    percent: {
      type: Number,
      default: 0
    },
    steps: {
      type: Number,
      default: 0
    },
    animation: {
      type: Boolean,
      default: false
    },
    strokeWidth: {
      type: Number
    },
    width: {
      type: [Number, String]
    },
    color: {
      type: [String, Object]
    },
    trackColor: String,
    bufferColor: {
      type: [String, Object]
    },
    showText: {
      type: Boolean,
      default: true
    },
    status: {
      type: String
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("progress");
    const { size } = toRefs(props);
    const type = computed(() => props.steps > 0 ? "steps" : props.type);
    const computedStatus = computed(() => {
      return props.status || (props.percent >= 1 ? "success" : "normal");
    });
    const { mergedSize } = useSize(size);
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-type-${type.value}`,
      `${prefixCls}-size-${mergedSize.value}`,
      `${prefixCls}-status-${computedStatus.value}`
    ]);
    return {
      cls,
      computedStatus,
      mergedSize
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_progress_steps = resolveComponent("progress-steps");
  const _component_progress_line = resolveComponent("progress-line");
  const _component_progress_circle = resolveComponent("progress-circle");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    _ctx.steps > 0 ? (openBlock(), createBlock(_component_progress_steps, {
      key: 0,
      "stroke-width": _ctx.strokeWidth,
      percent: _ctx.percent,
      color: _ctx.color,
      "track-color": _ctx.trackColor,
      width: _ctx.width,
      steps: _ctx.steps,
      size: _ctx.mergedSize,
      "show-text": _ctx.showText
    }, createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: withCtx((scope) => [
          renderSlot(_ctx.$slots, "text", normalizeProps(guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["stroke-width", "percent", "color", "track-color", "width", "steps", "size", "show-text"])) : _ctx.type === "line" && _ctx.mergedSize !== "mini" ? (openBlock(), createBlock(_component_progress_line, {
      key: 1,
      "stroke-width": _ctx.strokeWidth,
      animation: _ctx.animation,
      percent: _ctx.percent,
      color: _ctx.color,
      "track-color": _ctx.trackColor,
      size: _ctx.mergedSize,
      "buffer-color": _ctx.bufferColor,
      width: _ctx.width,
      "show-text": _ctx.showText,
      status: _ctx.computedStatus
    }, createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: withCtx((scope) => [
          renderSlot(_ctx.$slots, "text", normalizeProps(guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["stroke-width", "animation", "percent", "color", "track-color", "size", "buffer-color", "width", "show-text", "status"])) : (openBlock(), createBlock(_component_progress_circle, {
      key: 2,
      type: _ctx.type,
      "stroke-width": _ctx.type === "line" ? _ctx.strokeWidth || 4 : _ctx.strokeWidth,
      "path-stroke-width": _ctx.type === "line" ? _ctx.strokeWidth || 4 : _ctx.strokeWidth,
      width: _ctx.width,
      percent: _ctx.percent,
      color: _ctx.color,
      "track-color": _ctx.trackColor,
      size: _ctx.mergedSize,
      "show-text": _ctx.showText,
      status: _ctx.computedStatus
    }, createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: withCtx((scope) => [
          renderSlot(_ctx.$slots, "text", normalizeProps(guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["type", "stroke-width", "path-stroke-width", "width", "percent", "color", "track-color", "size", "show-text", "status"]))
  ], 2);
}
var _Progress = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Progress as default };
