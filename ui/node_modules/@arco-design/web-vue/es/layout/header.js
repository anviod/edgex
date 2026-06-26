import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "LayoutHeader",
  setup() {
    const prefixCls = getPrefixCls("layout-header");
    const classNames = [prefixCls];
    return {
      classNames
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("header", {
    class: normalizeClass(_ctx.classNames)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var LayoutHeader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { LayoutHeader as default };
