import { defineComponent, inject, computed, resolveComponent, openBlock, createElementBlock, mergeProps, createElementVNode, normalizeClass, renderSlot, createBlock, withModifiers, withCtx, createVNode, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import { tabsInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TabsTab",
  components: {
    IconHover,
    IconClose
  },
  props: {
    tab: {
      type: Object,
      required: true
    },
    active: Boolean,
    editable: Boolean
  },
  emits: ["click", "delete"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("tabs-tab");
    const tabsCtx = inject(tabsInjectionKey, {});
    const handleClick = (e) => {
      if (!props.tab.disabled) {
        emit("click", props.tab.key, e);
      }
    };
    const onKeyDown = (ev) => {
      if (ev.key === "Enter") {
        handleClick(ev);
      }
    };
    const eventHandlers = computed(() => {
      return Object.assign(
        tabsCtx.trigger === "click" ? { onClick: handleClick } : { onMouseover: handleClick },
        { onKeydown: onKeyDown }
      );
    });
    const handleDelete = (e) => {
      if (!props.tab.disabled) {
        emit("delete", props.tab.key, e);
      }
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-closable`]: props.editable && props.tab.closable,
        [`${prefixCls}-disabled`]: props.tab.disabled
      }
    ]);
    return {
      prefixCls,
      cls,
      eventHandlers,
      handleDelete
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_close = resolveComponent("icon-close");
  const _component_icon_hover = resolveComponent("icon-hover");
  return openBlock(), createElementBlock("div", mergeProps({
    tabindex: "0",
    class: _ctx.cls
  }, _ctx.eventHandlers), [
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.editable && _ctx.tab.closable ? (openBlock(), createBlock(_component_icon_hover, {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: withModifiers(_ctx.handleDelete, ["stop"])
    }, {
      default: withCtx(() => [
        createVNode(_component_icon_close)
      ]),
      _: 1
    }, 8, ["class", "onClick"])) : createCommentVNode("v-if", true)
  ], 16);
}
var TabsTab = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TabsTab as default };
