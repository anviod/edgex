import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ListItemMeta",
  props: {
    title: String,
    description: String
  },
  setup(props, { slots }) {
    const prefixCls = getPrefixCls("list-item-meta");
    const hasContent = Boolean(
      props.title || props.description || slots.title || slots.description
    );
    return {
      prefixCls,
      hasContent
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.$slots.avatar ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-avatar`)
    }, [
      renderSlot(_ctx.$slots, "avatar")
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.hasContent ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      _ctx.$slots.title || _ctx.title ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-title`)
      }, [
        renderSlot(_ctx.$slots, "title", {}, () => [
          createTextVNode(toDisplayString(_ctx.title), 1)
        ])
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.$slots.description || _ctx.description ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-description`)
      }, [
        renderSlot(_ctx.$slots, "description", {}, () => [
          createTextVNode(toDisplayString(_ctx.description), 1)
        ])
      ], 2)) : createCommentVNode("v-if", true)
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var ListItemMeta = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ListItemMeta as default };
