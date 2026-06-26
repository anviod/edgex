import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "LayoutFooter",
  setup() {
    const prefixCls = getPrefixCls("layout-footer");
    const classNames = [prefixCls];
    return {
      classNames
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("footer", {
    class: normalizeClass(_ctx.classNames)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var LayoutFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LayoutFooter as default };
