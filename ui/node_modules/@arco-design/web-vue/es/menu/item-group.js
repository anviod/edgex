import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, renderSlot, createTextVNode, toDisplayString } from "vue";
import useMenuContext from "./hooks/use-menu-context.js";
import useLevel, { provideLevel } from "./hooks/use-level.js";
import MenuIndent from "./indent.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "MenuItemGroup",
  components: {
    MenuIndent
  },
  props: {
    title: {
      type: String
    }
  },
  setup() {
    const { level } = useLevel();
    const nextLevel = computed(
      () => level.value === 1 ? level.value + 1 : level.value
    );
    provideLevel(nextLevel);
    const menuContext = useMenuContext();
    const prefixCls = computed(() => menuContext.prefixCls);
    const classNames = computed(() => [`${prefixCls.value}-group`]);
    return {
      prefixCls,
      classNames,
      level
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenuIndent = resolveComponent("MenuIndent");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-group-title`)
    }, [
      createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ], 2),
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var MenuItemGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MenuItemGroup as default };
