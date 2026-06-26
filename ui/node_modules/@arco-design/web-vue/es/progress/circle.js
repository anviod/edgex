import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createBlock, createElementVNode, Fragment, renderList, createCommentVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject } from "../_utils/is.js";
import IconExclamation from "../icon/icon-exclamation/index.js";
import IconCheck from "../icon/icon-check/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
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
const _sfc_main = defineComponent({
  name: "ProgressCircle",
  components: {
    IconExclamation,
    IconCheck
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
    const prefixCls = getPrefixCls("progress-circle");
    const isLinearGradient = isObject(props.color);
    const mergedWidth = computed(() => {
      var _a;
      return (_a = props.width) != null ? _a : DEFAULT_WIDTH[props.size];
    });
    const mergedStrokeWidth = computed(
      () => {
        var _a;
        return (_a = props.strokeWidth) != null ? _a : props.size === "mini" ? mergedWidth.value / 2 : DEFAULT_STROKE_WIDTH[props.size];
      }
    );
    const mergedPathStrokeWidth = computed(
      () => {
        var _a;
        return (_a = props.pathStrokeWidth) != null ? _a : props.size === "mini" ? mergedStrokeWidth.value : Math.max(2, mergedStrokeWidth.value - 2);
      }
    );
    const radius = computed(
      () => (mergedWidth.value - mergedStrokeWidth.value) / 2
    );
    const perimeter = computed(() => Math.PI * 2 * radius.value);
    const center = computed(() => mergedWidth.value / 2);
    const linearGradientId = computed(() => {
      __ARCO_PROGRESS_SEED += 1;
      return `${prefixCls}-linear-gradient-${__ARCO_PROGRESS_SEED}`;
    });
    const text = computed(() => `${NP.times(props.percent, 100)}%`);
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
  const _component_icon_check = resolveComponent("icon-check");
  const _component_icon_exclamation = resolveComponent("icon-exclamation");
  return openBlock(), createElementBlock("div", {
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": _ctx.percent,
    class: normalizeClass(`${_ctx.prefixCls}-wrapper`),
    style: normalizeStyle({ width: `${_ctx.mergedWidth}px`, height: `${_ctx.mergedWidth}px` })
  }, [
    _ctx.type === "circle" && _ctx.size === "mini" && _ctx.status === "success" ? (openBlock(), createBlock(_component_icon_check, {
      key: 0,
      style: normalizeStyle({ fontSize: _ctx.mergedWidth - 2, color: _ctx.color })
    }, null, 8, ["style"])) : (openBlock(), createElementBlock("svg", {
      key: 1,
      viewBox: `0 0 ${_ctx.mergedWidth} ${_ctx.mergedWidth}`,
      class: normalizeClass(`${_ctx.prefixCls}-svg`)
    }, [
      _ctx.isLinearGradient ? (openBlock(), createElementBlock("defs", _hoisted_3, [
        createElementVNode("linearGradient", {
          id: _ctx.linearGradientId,
          x1: "0",
          y1: "1",
          x2: "0",
          y2: "0"
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys(_ctx.color), (key) => {
            return openBlock(), createElementBlock("stop", {
              key,
              offset: key,
              "stop-color": _ctx.color[key]
            }, null, 8, _hoisted_5);
          }), 128))
        ], 8, _hoisted_4)
      ])) : createCommentVNode("v-if", true),
      createElementVNode("circle", {
        class: normalizeClass(`${_ctx.prefixCls}-bg`),
        fill: "none",
        cx: _ctx.center,
        cy: _ctx.center,
        r: _ctx.radius,
        "stroke-width": _ctx.mergedPathStrokeWidth,
        style: normalizeStyle({
          stroke: _ctx.trackColor
        })
      }, null, 14, _hoisted_6),
      createElementVNode("circle", {
        class: normalizeClass(`${_ctx.prefixCls}-bar`),
        fill: "none",
        cx: _ctx.center,
        cy: _ctx.center,
        r: _ctx.radius,
        "stroke-width": _ctx.mergedStrokeWidth,
        style: normalizeStyle({
          stroke: _ctx.isLinearGradient ? `url(#${_ctx.linearGradientId})` : _ctx.color,
          strokeDasharray: _ctx.perimeter,
          strokeDashoffset: (_ctx.percent >= 1 ? 0 : 1 - _ctx.percent) * _ctx.perimeter
        })
      }, null, 14, _hoisted_7)
    ], 10, _hoisted_2)),
    _ctx.showText && _ctx.size !== "mini" ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-text`)
    }, [
      renderSlot(_ctx.$slots, "text", { percent: _ctx.percent }, () => [
        _ctx.status === "danger" ? (openBlock(), createBlock(_component_icon_exclamation, { key: 0 })) : _ctx.status === "success" ? (openBlock(), createBlock(_component_icon_check, { key: 1 })) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
          createTextVNode(toDisplayString(_ctx.text), 1)
        ], 64))
      ])
    ], 2)) : createCommentVNode("v-if", true)
  ], 14, _hoisted_1);
}
var ProgressCircle = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ProgressCircle as default };
