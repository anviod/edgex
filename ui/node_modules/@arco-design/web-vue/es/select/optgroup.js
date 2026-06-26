import { defineComponent, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, renderSlot, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Optgroup",
  props: {
    label: {
      type: String
    }
  },
  setup() {
    const prefixCls = getPrefixCls("select-group");
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
      renderSlot(_ctx.$slots, "label", {}, () => [
        createTextVNode(toDisplayString(_ctx.label), 1)
      ])
    ], 2),
    renderSlot(_ctx.$slots, "default")
  ], 64);
}
var Optgroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Optgroup as default };
