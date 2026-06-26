import { defineComponent, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, renderSlot, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Dgroup",
  props: {
    title: String
  },
  setup() {
    const prefixCls = getPrefixCls("dropdown-group");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("li", {
      class: normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ], 2),
    renderSlot(_ctx.$slots, "default")
  ], 64);
}
var Dgroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Dgroup as default };
