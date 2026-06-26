import { defineComponent, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Typography",
  setup() {
    const prefixCls = getPrefixCls("typography");
    return {
      classNames: [prefixCls]
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("article", {
    class: normalizeClass(_ctx.classNames)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Typography = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Typography as default };
