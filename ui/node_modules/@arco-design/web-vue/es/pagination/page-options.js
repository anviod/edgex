import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, mergeProps } from "vue";
import { useI18n } from "../locale/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Select from "../select/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PageOptions",
  components: {
    ArcoSelect: Select
  },
  props: {
    sizeOptions: {
      type: Array,
      required: true
    },
    pageSize: Number,
    disabled: Boolean,
    size: {
      type: String
    },
    onChange: {
      type: Function
    },
    selectProps: {
      type: Object
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("pagination-options");
    const { t } = useI18n();
    const options = computed(
      () => props.sizeOptions.map((value) => ({
        value,
        label: `${value} ${t("pagination.countPerPage")}`
      }))
    );
    const handleChange = (value) => {
      emit("change", value);
    };
    return {
      prefixCls,
      options,
      handleChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_arco_select = resolveComponent("arco-select");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    createVNode(_component_arco_select, mergeProps({
      "model-value": _ctx.pageSize,
      options: _ctx.options,
      size: _ctx.size,
      disabled: _ctx.disabled
    }, _ctx.selectProps, { onChange: _ctx.handleChange }), null, 16, ["model-value", "options", "size", "disabled", "onChange"])
  ], 2);
}
var PageOptions = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PageOptions as default };
