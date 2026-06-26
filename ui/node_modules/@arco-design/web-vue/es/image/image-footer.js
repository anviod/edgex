import { defineComponent, openBlock, createElementBlock, normalizeClass, toDisplayString, createCommentVNode, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ImageFooter",
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  setup() {
    const prefixCls = getPrefixCls("image-footer");
    return {
      prefixCls
    };
  }
});
const _hoisted_1 = ["title"];
const _hoisted_2 = ["title"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.title || _ctx.description ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-caption`)
    }, [
      _ctx.title ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-caption-title`),
        title: _ctx.title
      }, toDisplayString(_ctx.title), 11, _hoisted_1)) : createCommentVNode("v-if", true),
      _ctx.description ? (openBlock(), createElementBlock("div", {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-caption-description`),
        title: _ctx.description
      }, toDisplayString(_ctx.description), 11, _hoisted_2)) : createCommentVNode("v-if", true)
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-extra`)
    }, [
      renderSlot(_ctx.$slots, "extra")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var ImageFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ImageFooter as default };
