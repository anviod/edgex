"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-up/index.js");
var index$1 = require("../icon/icon-down/index.js");
var index$2 = require("../icon/icon-left/index.js");
var index$3 = require("../icon/icon-right/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Arrow",
  components: {
    IconUp: index,
    IconDown: index$1,
    IconLeft: index$2,
    IconRight: index$3
  },
  props: {
    direction: {
      type: String,
      default: "horizontal"
    },
    showArrow: {
      type: String,
      default: "always"
    }
  },
  emits: ["previousClick", "nextClick"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("carousel");
    const onPreviousClick = (ev) => {
      emit("previousClick", ev);
    };
    const onNextClick = (ev) => {
      emit("nextClick", ev);
    };
    const cls = vue.computed(() => [
      `${prefixCls}-arrow`,
      {
        [`${prefixCls}-arrow-hover`]: props.showArrow === "hover"
      }
    ]);
    return {
      prefixCls,
      cls,
      onPreviousClick,
      onNextClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconLeft = vue.resolveComponent("IconLeft");
  const _component_IconUp = vue.resolveComponent("IconUp");
  const _component_IconRight = vue.resolveComponent("IconRight");
  const _component_IconDown = vue.resolveComponent("IconDown");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-arrow-${_ctx.direction === "vertical" ? "top" : "left"}`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onPreviousClick && _ctx.onPreviousClick(...args))
    }, [
      _ctx.direction === "horizontal" ? (vue.openBlock(), vue.createBlock(_component_IconLeft, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconUp, { key: 1 }))
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-arrow-${_ctx.direction === "vertical" ? "bottom" : "right"}`),
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.onNextClick && _ctx.onNextClick(...args))
    }, [
      _ctx.direction === "horizontal" ? (vue.openBlock(), vue.createBlock(_component_IconRight, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconDown, { key: 1 }))
    ], 2)
  ], 2);
}
var CarouselArrow = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = CarouselArrow;
