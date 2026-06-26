import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Skeleton",
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    animation: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("skeleton");
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-animation`]: props.animation
      }
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
  }, [
    _ctx.loading ? renderSlot(_ctx.$slots, "default", { key: 0 }) : renderSlot(_ctx.$slots, "content", { key: 1 })
  ], 2);
}
var _Skeleton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Skeleton as default };
