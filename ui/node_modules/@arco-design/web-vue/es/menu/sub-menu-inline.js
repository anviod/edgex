import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, Fragment, renderSlot, createTextVNode, toDisplayString, withCtx, withDirectives, vShow } from "vue";
import useMenuContext from "./hooks/use-menu-context.js";
import useMenu from "./hooks/use-menu.js";
import useLevel from "./hooks/use-level.js";
import MenuIndent from "./indent.js";
import ExpandTransition from "../_components/transition/expand-transition.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SubMenuInline",
  components: {
    MenuIndent,
    ExpandTransition
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
    const { level } = useLevel({
      provideNextLevel: true
    });
    const menuContext = useMenuContext();
    const menuPrefixCls = computed(() => menuContext.prefixCls);
    const prefixCls = computed(() => `${menuPrefixCls.value}-inline`);
    const classNames = computed(() => [prefixCls.value]);
    const isSelected = computed(() => props.isChildrenSelected);
    const isOpen = computed(
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
  const _component_MenuIndent = resolveComponent("MenuIndent");
  const _component_ExpandTransition = resolveComponent("ExpandTransition");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    createElementVNode("div", {
      class: normalizeClass([
        `${_ctx.prefixCls}-header`,
        {
          [`${_ctx.menuPrefixCls}-selected`]: _ctx.isSelected,
          [`${_ctx.menuPrefixCls}-has-icon`]: _ctx.$slots.icon
        }
      ]),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onHeaderClick && _ctx.onHeaderClick(...args))
    }, [
      createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
      _ctx.$slots.icon ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.menuPrefixCls}-icon`)
        }, [
          renderSlot(_ctx.$slots, "icon")
        ], 2),
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.menuPrefixCls}-title`)
        }, [
          renderSlot(_ctx.$slots, "title", {}, () => [
            createTextVNode(toDisplayString(_ctx.title), 1)
          ])
        ], 2)
      ], 64)) : renderSlot(_ctx.$slots, "title", { key: 1 }, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ]),
      createElementVNode("span", {
        class: normalizeClass([
          `${_ctx.menuPrefixCls}-icon-suffix`,
          {
            [`is-open`]: _ctx.isOpen
          }
        ])
      }, [
        renderSlot(_ctx.$slots, "expand-icon-down")
      ], 2)
    ], 2),
    createVNode(_component_ExpandTransition, null, {
      default: withCtx(() => [
        withDirectives(createElementVNode("div", {
          class: normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2), [
          [vShow, _ctx.isOpen]
        ])
      ]),
      _: 3
    })
  ], 2);
}
var SubMenuInline = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SubMenuInline as default };
