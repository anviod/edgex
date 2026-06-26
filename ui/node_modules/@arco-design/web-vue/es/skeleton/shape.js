import { defineComponent, computed, openBlock, createElementBlock, normalizeClass } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SkeletonShape",
  props: {
    shape: {
      type: String,
      default: "square"
    },
    size: {
      type: String,
      default: "medium"
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("skeleton-shape");
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-${props.shape}`,
      `${prefixCls}-${props.size}`
    ]);
    return {
      prefixCls,
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, null, 2);
}
var SkeletonShape = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SkeletonShape as default };
