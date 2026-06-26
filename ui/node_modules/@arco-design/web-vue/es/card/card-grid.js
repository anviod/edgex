import { defineComponent, inject, onMounted, computed, openBlock, createElementBlock, normalizeClass, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { cardInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "CardGrid",
  props: {
    hoverable: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("card-grid");
    const context = inject(cardInjectionKey);
    onMounted(() => {
      if (context) {
        context.hasGrid = true;
      }
    });
    const cls = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}-hoverable`]: props.hoverable
        }
      ];
    });
    return {
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var CardGrid = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { CardGrid as default };
