"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "DescriptionsItem",
  props: {
    span: {
      type: Number,
      default: 1
    },
    label: String
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("descriptions");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.renderSlot(_ctx.$slots, "default");
}
var DescriptionsItem = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DescriptionsItem;
