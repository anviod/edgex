import { defineComponent, ref, inject, onMounted, computed, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createTextVNode, toDisplayString, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { anchorInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "AnchorLink",
  props: {
    title: String,
    href: String
  },
  setup(props) {
    const prefixCls = getPrefixCls("anchor");
    const linkCls = `${prefixCls}-link`;
    const linkRef = ref();
    const context = inject(anchorInjectionKey, void 0);
    onMounted(() => {
      if (props.href && linkRef.value) {
        context == null ? void 0 : context.addLink(props.href, linkRef.value);
      }
    });
    const cls = computed(() => [
      `${linkCls}-item`,
      {
        [`${linkCls}-active`]: (context == null ? void 0 : context.currentLink) === props.href
      }
    ]);
    const handleClick = (e) => context == null ? void 0 : context.handleClick(e, props.href);
    return {
      prefixCls,
      linkCls,
      cls,
      linkRef,
      handleClick
    };
  }
});
const _hoisted_1 = ["href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    ref: "linkRef",
    class: normalizeClass(_ctx.cls)
  }, [
    createElementVNode("a", {
      class: normalizeClass(_ctx.linkCls),
      href: _ctx.href,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ], 10, _hoisted_1),
    _ctx.$slots.sublist ? (openBlock(), createElementBlock("ul", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-sublist`)
    }, [
      renderSlot(_ctx.$slots, "sublist")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var AnchorLink = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { AnchorLink as default };
