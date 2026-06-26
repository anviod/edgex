import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, Fragment, renderList, toDisplayString } from "vue";
import useDatePickerTransform from "../hooks/use-inject-datepicker-transform.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PanelWeekList",
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    weekList: {
      type: Array,
      required: true
    }
  },
  setup() {
    const datePickerT = useDatePickerTransform();
    const labelList = computed(() => {
      return [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ].map((i) => datePickerT(`datePicker.week.short.${i}`));
    });
    return {
      labelList
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-week-list`)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.weekList, (key) => {
      return openBlock(), createElementBlock("div", {
        key,
        class: normalizeClass(`${_ctx.prefixCls}-week-list-item`)
      }, toDisplayString(_ctx.labelList[key] || ""), 3);
    }), 128))
  ], 2);
}
var PanelWeekList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PanelWeekList as default };
