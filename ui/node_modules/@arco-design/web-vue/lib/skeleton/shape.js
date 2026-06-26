"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SkeletonShape",
  props: {
    shape: {
      type: String,
      default: "square"
    },
    size: {
      type: String,
      default: "medium"
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("skeleton-shape");
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-${props.shape}`,
      `${prefixCls}-${props.size}`
    ]);
    return {
      prefixCls,
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, null, 2);
}
var SkeletonShape = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SkeletonShape;
