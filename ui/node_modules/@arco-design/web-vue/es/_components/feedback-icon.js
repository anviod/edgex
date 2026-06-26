import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, createCommentVNode } from "vue";
import IconLoading from "../icon/icon-loading/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "FeedbackIcon",
  components: {
    IconLoading,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill
  },
  props: {
    type: {
      type: String
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("feedback-icon");
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-status-${props.type}`
    ]);
    return {
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_loading = resolveComponent("icon-loading");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass(_ctx.cls)
  }, [
    _ctx.type === "validating" ? (openBlock(), createBlock(_component_icon_loading, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : createCommentVNode("v-if", true)
  ], 2);
}
var FeedbackIcon = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FeedbackIcon as default };
