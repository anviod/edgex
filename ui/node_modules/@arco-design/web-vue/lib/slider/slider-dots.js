"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SliderDots",
  props: {
    data: {
      type: Array,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      default: "horizontal"
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("slider");
    const getStyle = (value) => utils.getPositionStyle(
      utils.getOffsetPercent(value, [props.min, props.max]),
      props.direction
    );
    return {
      prefixCls,
      getStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-dots`)
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.data, (item, index) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        key: index,
        class: vue.normalizeClass(`${_ctx.prefixCls}-dot-wrapper`),
        style: vue.normalizeStyle(_ctx.getStyle(item.key))
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass([
            `${_ctx.prefixCls}-dot`,
            { [`${_ctx.prefixCls}-dot-active`]: item.isActive }
          ])
        }, null, 2)
      ], 6);
    }), 128))
  ], 2);
}
var SliderDots = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SliderDots;
