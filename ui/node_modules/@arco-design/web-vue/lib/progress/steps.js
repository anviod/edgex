"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-exclamation-circle-fill/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const _sfc_main = vue.defineComponent({
  name: "ProgressSteps",
  components: {
    IconExclamationCircleFill: index
  },
  props: {
    steps: {
      type: Number,
      default: 0
    },
    percent: {
      type: Number,
      default: 0
    },
    size: {
      type: String
    },
    color: {
      type: [String, Object],
      default: void 0
    },
    trackColor: String,
    strokeWidth: {
      type: Number
    },
    status: {
      type: String,
      default: void 0
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("progress-steps");
    const mergedStrokeWidth = vue.computed(
      () => {
        var _a;
        return ((_a = props.strokeWidth) != null ? _a : props.size === "small") ? 8 : 4;
      }
    );
    const stepList = vue.computed(
      () => [...Array(props.steps)].map((_, index2) => {
        return props.percent > 0 && props.percent > 1 / props.steps * index2;
      })
    );
    const text = vue.computed(() => `${NP__default["default"].times(props.percent, 100)}%`);
    return {
      prefixCls,
      stepList,
      mergedStrokeWidth,
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
      style: vue.normalizeStyle({ height: `${_ctx.mergedStrokeWidth}px` })
    }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.stepList, (active, index2) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          key: index2,
          class: vue.normalizeClass([
            `${_ctx.prefixCls}-item`,
            {
              [`${_ctx.prefixCls}-item-active`]: active
            }
          ]),
          style: vue.normalizeStyle({
            backgroundColor: active ? _ctx.color : _ctx.trackColor
          })
        }, null, 6);
      }), 128))
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
var ProgressSteps = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ProgressSteps;
