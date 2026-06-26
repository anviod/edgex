"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Skeleton",
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    animation: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("skeleton");
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-animation`]: props.animation
      }
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
  }, [
    _ctx.loading ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.renderSlot(_ctx.$slots, "content", { key: 1 })
  ], 2);
}
var _Skeleton = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Skeleton;
