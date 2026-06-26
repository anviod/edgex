"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var index = require("../icon/icon-exclamation-circle-fill/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const DEFAULT_STROKE_WIDTH = {
  small: 3,
  medium: 4,
  large: 8
};
const getBackground = (color) => {
  if (!color) {
    return void 0;
  }
  if (is.isObject(color)) {
    const val = Object.keys(color).map((key) => `${color[key]} ${key}`).join(",");
    return {
      backgroundImage: `linear-gradient(to right, ${val})`
    };
  }
  return {
    backgroundColor: color
  };
};
const _sfc_main = vue.defineComponent({
  name: "ProgressLine",
  components: {
    IconExclamationCircleFill: index
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    animation: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "medium"
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    width: {
      type: [Number, String],
      default: "100%"
    },
    color: {
      type: [String, Object],
      default: void 0
    },
    trackColor: String,
    formatText: {
      type: Function,
      default: void 0
    },
    status: {
      type: String
    },
    showText: Boolean
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("progress-line");
    const strokeWidth = vue.computed(() => {
      if (props.strokeWidth !== 4) {
        return props.strokeWidth;
      }
      return DEFAULT_STROKE_WIDTH[props.size];
    });
    const text = vue.computed(() => `${NP__default["default"].times(props.percent, 100)}%`);
    const style = vue.computed(() => ({
      width: props.width,
      height: `${strokeWidth.value}px`,
      backgroundColor: props.trackColor
    }));
    const barStyle = vue.computed(() => ({
      width: `${props.percent * 100}%`,
      ...getBackground(props.color)
    }));
    return {
      prefixCls,
      style,
      barStyle,
      text
    };
  }
});
const _hoisted_1 = ["aria-valuenow"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  return vue.openBlock(), vue.createElementBlock("div", {
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": _ctx.percent,
    class: vue.normalizeClass(`${_ctx.prefixCls}-wrapper`)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.prefixCls),
      style: vue.normalizeStyle(_ctx.style)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-bar-buffer`)
      }, null, 2),
      vue.createElementVNode("div", {
        class: vue.normalizeClass([`${_ctx.prefixCls}-bar`]),
        style: vue.normalizeStyle(_ctx.barStyle)
      }, null, 6)
    ], 6),
    _ctx.showText ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-text`)
    }, [
      vue.renderSlot(_ctx.$slots, "text", { percent: _ctx.percent }, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.text) + " ", 1),
        _ctx.status === "danger" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 0 })) : vue.createCommentVNode("v-if", true)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 10, _hoisted_1);
}
var ProgressLine = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ProgressLine;
