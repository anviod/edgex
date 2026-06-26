import _sfc_main from "./layout.vue_vue_type_script_lang.js";
import { openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("section", {
    class: normalizeClass(_ctx.classNames)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var _Layout = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Layout as default };
