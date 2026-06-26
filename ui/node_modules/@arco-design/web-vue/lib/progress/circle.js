"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var index = require("../icon/icon-exclamation/index.js");
var index$1 = require("../icon/icon-check/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
let __ARCO_PROGRESS_SEED = 0;
const DEFAULT_WIDTH = {
  mini: 16,
  small: 48,
  medium: 64,
  large: 80
};
const DEFAULT_STROKE_WIDTH = {
  mini: 4,
  small: 3,
  medium: 4,
  large: 4
};
const _sfc_main = vue.defineComponent({
  name: "ProgressCircle",
  components: {
    IconExclamation: index,
    IconCheck: index$1
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    type: {
      type: String
    },
    size: {
      type: String,
      default: "medium"
    },
    strokeWidth: {
      type: Number
    },
    width: {
      type: Number,
      default: void 0
    },
    color: {
      type: [String, Object],
      default: void 0
    },
    trackColor: String,
    status: {
      type: String,
      default: void 0
    },
    showText: {
      type: Boolean,
      default: true
    },
    pathStrokeWidth: {
      type: Number
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("progress-circle");
    const isLinearGradient = is.isObject(props.color);
    const mergedWidth = vue.computed(() => {
      var _a;
      return (_a = props.width) != null ? _a : DEFAULT_WIDTH[props.size];
    });
    const mergedStrokeWidth = vue.computed(
      () => {
        var _a;
        return (_a = props.strokeWidth) != null ? _a : props.size === "mini" ? mergedWidth.value / 2 : DEFAULT_STROKE_WIDTH[props.size];
      }
    );
    const mergedPathStrokeWidth = vue.computed(
      () => {
        var _a;
        return (_a = props.pathStrokeWidth) != null ? _a : props.size === "mini" ? mergedStrokeWidth.value : Math.max(2, mergedStrokeWidth.value - 2);
      }
    );
    const radius = vue.computed(
      () => (mergedWidth.value - mergedStrokeWidth.value) / 2
    );
    const perimeter = vue.computed(() => Math.PI * 2 * radius.value);
    const center = vue.computed(() => mergedWidth.value / 2);
    const linearGradientId = vue.computed(() => {
      __ARCO_PROGRESS_SEED += 1;
      return `${prefixCls}-linear-gradient-${__ARCO_PROGRESS_SEED}`;
    });
    const text = vue.computed(() => `${NP__default["default"].times(props.percent, 100)}%`);
    return {
      prefixCls,
      isLinearGradient,
      radius,
      text,
      perimeter,
      center,
      mergedWidth,
      mergedStrokeWidth,
      mergedPathStrokeWidth,
      linearGradientId
    };
  }
});
const _hoisted_1 = ["aria-valuenow"];
const _hoisted_2 = ["viewBox"];
const _hoisted_3 = { key: 0 };
const _hoisted_4 = ["id"];
const _hoisted_5 = ["offset", "stop-color"];
const _hoisted_6 = ["cx", "cy", "r", "stroke-width"];
const _hoisted_7 = ["cx", "cy", "r", "stroke-width"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_check = vue.resolveComponent("icon-check");
  const _component_icon_exclamation = vue.resolveComponent("icon-exclamation");
  return vue.openBlock(), vue.createElementBlock("div", {
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": _ctx.percent,
    class: vue.normalizeClass(`${_ctx.prefixCls}-wrapper`),
    style: vue.normalizeStyle({ width: `${_ctx.mergedWidth}px`, height: `${_ctx.mergedWidth}px` })
  }, [
    _ctx.type === "circle" && _ctx.size === "mini" && _ctx.status === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check, {
      key: 0,
      style: vue.normalizeStyle({ fontSize: _ctx.mergedWidth - 2, color: _ctx.color })
    }, null, 8, ["style"])) : (vue.openBlock(), vue.createElementBlock("svg", {
      key: 1,
      viewBox: `0 0 ${_ctx.mergedWidth} ${_ctx.mergedWidth}`,
      class: vue.normalizeClass(`${_ctx.prefixCls}-svg`)
    }, [
      _ctx.isLinearGradient ? (vue.openBlock(), vue.createElementBlock("defs", _hoisted_3, [
        vue.createElementVNode("linearGradient", {
          id: _ctx.linearGradientId,
          x1: "0",
          y1: "1",
          x2: "0",
          y2: "0"
        }, [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(Object.keys(_ctx.color), (key) => {
            return vue.openBlock(), vue.createElementBlock("stop", {
              key,
              offset: key,
              "stop-color": _ctx.color[key]
            }, null, 8, _hoisted_5);
          }), 128))
        ], 8, _hoisted_4)
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("circle", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-bg`),
        fill: "none",
        cx: _ctx.center,
        cy: _ctx.center,
        r: _ctx.radius,
        "stroke-width": _ctx.mergedPathStrokeWidth,
        style: vue.normalizeStyle({
          stroke: _ctx.trackColor
        })
      }, null, 14, _hoisted_6),
      vue.createElementVNode("circle", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-bar`),
        fill: "none",
        cx: _ctx.center,
        cy: _ctx.center,
        r: _ctx.radius,
        "stroke-width": _ctx.mergedStrokeWidth,
        style: vue.normalizeStyle({
          stroke: _ctx.isLinearGradient ? `url(#${_ctx.linearGradientId})` : _ctx.color,
          strokeDasharray: _ctx.perimeter,
          strokeDashoffset: (_ctx.percent >= 1 ? 0 : 1 - _ctx.percent) * _ctx.perimeter
        })
      }, null, 14, _hoisted_7)
    ], 10, _hoisted_2)),
    _ctx.showText && _ctx.size !== "mini" ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-text`)
    }, [
      vue.renderSlot(_ctx.$slots, "text", { percent: _ctx.percent }, () => [
        _ctx.status === "danger" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation, { key: 0 })) : _ctx.status === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check, { key: 1 })) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
          vue.createTextVNode(vue.toDisplayString(_ctx.text), 1)
        ], 64))
      ])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 14, _hoisted_1);
}
var ProgressCircle = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ProgressCircle;
