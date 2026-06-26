"use strict";
var vue = require("vue");
var useMenuContext = require("./hooks/use-menu-context.js");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "MenuIndent",
  props: {
    level: {
      type: Number,
      default: 1
    }
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("menu");
    const menuContext = useMenuContext();
    return {
      prefixCls,
      levelIndent: vue.toRef(menuContext, "levelIndent")
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.level > 1 ? (vue.openBlock(), vue.createElementBlock("span", {
    key: 0,
    class: vue.normalizeClass(`${_ctx.prefixCls}-indent-list`)
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.level - 1, (index) => {
      return vue.openBlock(), vue.createElementBlock("span", {
        key: index,
        class: vue.normalizeClass(`${_ctx.prefixCls}-indent`),
        style: vue.normalizeStyle(`width: ${_ctx.levelIndent}px`)
      }, null, 6);
    }), 128))
  ], 2)) : vue.createCommentVNode("v-if", true);
}
var MenuIndent = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = MenuIndent;
