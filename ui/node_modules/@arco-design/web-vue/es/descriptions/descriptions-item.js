import { defineComponent, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "DescriptionsItem",
  props: {
    span: {
      type: Number,
      default: 1
    },
    label: String
  },
  setup() {
    const prefixCls = getPrefixCls("descriptions");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return renderSlot(_ctx.$slots, "default");
}
var DescriptionsItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DescriptionsItem as default };
