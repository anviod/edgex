"use strict";
var vue = require("vue");
var line = require("./line.js");
var circle = require("./circle.js");
var steps = require("./steps.js");
var globalConfig = require("../_utils/global-config.js");
var useSize = require("../_hooks/use-size.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Progress",
  components: {
    ProgressLine: line,
    ProgressCircle: circle,
    ProgressSteps: steps
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
    const prefixCls = globalConfig.getPrefixCls("progress");
    const { size } = vue.toRefs(props);
    const type = vue.computed(() => props.steps > 0 ? "steps" : props.type);
    const computedStatus = vue.computed(() => {
      return props.status || (props.percent >= 1 ? "success" : "normal");
    });
    const { mergedSize } = useSize.useSize(size);
    const cls = vue.computed(() => [
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
  const _component_progress_steps = vue.resolveComponent("progress-steps");
  const _component_progress_line = vue.resolveComponent("progress-line");
  const _component_progress_circle = vue.resolveComponent("progress-circle");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    _ctx.steps > 0 ? (vue.openBlock(), vue.createBlock(_component_progress_steps, {
      key: 0,
      "stroke-width": _ctx.strokeWidth,
      percent: _ctx.percent,
      color: _ctx.color,
      "track-color": _ctx.trackColor,
      width: _ctx.width,
      steps: _ctx.steps,
      size: _ctx.mergedSize,
      "show-text": _ctx.showText
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: vue.withCtx((scope) => [
          vue.renderSlot(_ctx.$slots, "text", vue.normalizeProps(vue.guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["stroke-width", "percent", "color", "track-color", "width", "steps", "size", "show-text"])) : _ctx.type === "line" && _ctx.mergedSize !== "mini" ? (vue.openBlock(), vue.createBlock(_component_progress_line, {
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
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: vue.withCtx((scope) => [
          vue.renderSlot(_ctx.$slots, "text", vue.normalizeProps(vue.guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["stroke-width", "animation", "percent", "color", "track-color", "size", "buffer-color", "width", "show-text", "status"])) : (vue.openBlock(), vue.createBlock(_component_progress_circle, {
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
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.text ? {
        name: "text",
        fn: vue.withCtx((scope) => [
          vue.renderSlot(_ctx.$slots, "text", vue.normalizeProps(vue.guardReactiveProps(scope)))
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["type", "stroke-width", "path-stroke-width", "width", "percent", "color", "track-color", "size", "show-text", "status"]))
  ], 2);
}
var _Progress = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Progress;
