"use strict";
var vue = require("vue");
var useInjectDatepickerTransform = require("../hooks/use-inject-datepicker-transform.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const datePickerT = useInjectDatepickerTransform();
    const labelList = vue.computed(() => {
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
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-week-list`)
  }, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.weekList, (key) => {
      return vue.openBlock(), vue.createElementBlock("div", {
        key,
        class: vue.normalizeClass(`${_ctx.prefixCls}-week-list-item`)
      }, vue.toDisplayString(_ctx.labelList[key] || ""), 3);
    }), 128))
  ], 2);
}
var PanelWeekList = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PanelWeekList;
