"use strict";
var vue = require("vue");
var useMenuContext = require("./hooks/use-menu-context.js");
var useMenu = require("./hooks/use-menu.js");
var useLevel = require("./hooks/use-level.js");
var indent = require("./indent.js");
var expandTransition = require("../_components/transition/expand-transition.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SubMenuInline",
  components: {
    MenuIndent: indent,
    ExpandTransition: expandTransition
  },
  props: {
    title: {
      type: String
    },
    isChildrenSelected: {
      type: Boolean
    }
  },
  setup(props) {
    const { key } = useMenu();
    const { level } = useLevel["default"]({
      provideNextLevel: true
    });
    const menuContext = useMenuContext();
    const menuPrefixCls = vue.computed(() => menuContext.prefixCls);
    const prefixCls = vue.computed(() => `${menuPrefixCls.value}-inline`);
    const classNames = vue.computed(() => [prefixCls.value]);
    const isSelected = vue.computed(() => props.isChildrenSelected);
    const isOpen = vue.computed(
      () => (menuContext.openKeys || []).indexOf(key.value) > -1
    );
    return {
      prefixCls,
      menuPrefixCls,
      classNames,
      level,
      isSelected,
      isOpen,
      onHeaderClick: () => {
        menuContext.onSubMenuClick && menuContext.onSubMenuClick(key.value, level.value);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenuIndent = vue.resolveComponent("MenuIndent");
  const _component_ExpandTransition = vue.resolveComponent("ExpandTransition");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass([
        `${_ctx.prefixCls}-header`,
        {
          [`${_ctx.menuPrefixCls}-selected`]: _ctx.isSelected,
          [`${_ctx.menuPrefixCls}-has-icon`]: _ctx.$slots.icon
        }
      ]),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onHeaderClick && _ctx.onHeaderClick(...args))
    }, [
      vue.createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
      _ctx.$slots.icon ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.menuPrefixCls}-icon`)
        }, [
          vue.renderSlot(_ctx.$slots, "icon")
        ], 2),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.menuPrefixCls}-title`)
        }, [
          vue.renderSlot(_ctx.$slots, "title", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
          ])
        ], 2)
      ], 64)) : vue.renderSlot(_ctx.$slots, "title", { key: 1 }, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ]),
      vue.createElementVNode("span", {
        class: vue.normalizeClass([
          `${_ctx.menuPrefixCls}-icon-suffix`,
          {
            [`is-open`]: _ctx.isOpen
          }
        ])
      }, [
        vue.renderSlot(_ctx.$slots, "expand-icon-down")
      ], 2)
    ], 2),
    vue.createVNode(_component_ExpandTransition, null, {
      default: vue.withCtx(() => [
        vue.withDirectives(vue.createElementVNode("div", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2), [
          [vue.vShow, _ctx.isOpen]
        ])
      ]),
      _: 3
    })
  ], 2);
}
var SubMenuInline = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SubMenuInline;
