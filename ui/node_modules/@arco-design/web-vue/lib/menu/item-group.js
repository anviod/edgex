"use strict";
var vue = require("vue");
var useMenuContext = require("./hooks/use-menu-context.js");
var useLevel = require("./hooks/use-level.js");
var indent = require("./indent.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "MenuItemGroup",
  components: {
    MenuIndent: indent
  },
  props: {
    title: {
      type: String
    }
  },
  setup() {
    const { level } = useLevel["default"]();
    const nextLevel = vue.computed(
      () => level.value === 1 ? level.value + 1 : level.value
    );
    useLevel.provideLevel(nextLevel);
    const menuContext = useMenuContext();
    const prefixCls = vue.computed(() => menuContext.prefixCls);
    const classNames = vue.computed(() => [`${prefixCls.value}-group`]);
    return {
      prefixCls,
      classNames,
      level
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenuIndent = vue.resolveComponent("MenuIndent");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-group-title`)
    }, [
      vue.createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
      vue.renderSlot(_ctx.$slots, "title", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ])
    ], 2),
    vue.renderSlot(_ctx.$slots, "default")
  ], 2);
}
var MenuItemGroup = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = MenuItemGroup;
