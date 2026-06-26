"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SkeletonLine",
  props: {
    rows: {
      type: Number,
      default: 1
    },
    widths: {
      type: Array,
      default: () => []
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    lineSpacing: {
      type: Number,
      default: 15
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("skeleton-line");
    const lines = [];
    for (let i = 0; i < props.rows; i++) {
      const style = {};
      if (is.isNumber(props.widths[i])) {
        style.width = `${props.widths[i]}px`;
      } else if (is.isString(props.widths[i])) {
        style.width = String(props.widths[i]);
      }
      style.height = `${props.lineHeight}px`;
      if (i > 0) {
        style.marginTop = `${props.lineSpacing}px`;
      }
      lines.push(style);
    }
    return {
      prefixCls,
      lines
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.lines, (style, index) => {
    return vue.openBlock(), vue.createElementBlock("ul", {
      key: index,
      class: vue.normalizeClass(_ctx.prefixCls)
    }, [
      vue.createElementVNode("li", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-row`),
        style: vue.normalizeStyle(style)
      }, null, 6)
    ], 2);
  }), 128);
}
var SkeletonLine = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SkeletonLine;
