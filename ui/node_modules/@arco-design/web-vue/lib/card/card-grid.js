"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "CardGrid",
  props: {
    hoverable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("card-grid");
    const context$1 = vue.inject(context.cardInjectionKey);
    vue.onMounted(() => {
      if (context$1) {
        context$1.hasGrid = true;
      }
    });
    const cls = vue.computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-hoverable`]: props.hoverable
        }
      ];
    });
    return {
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var CardGrid = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = CardGrid;
