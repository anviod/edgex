"use strict";
var vue = require("vue");
var date = require("../../../_utils/date.js");
var index = require("../date/index.js");
var index$1 = require("../../../locale/index.js");
var pluginVue_exportHelper = require("../../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "WeekPanel",
  components: {
    DatePanel: index
  },
  props: {
    dayStartOfWeek: {
      type: Number,
      default: 0
    }
  },
  emits: ["select", "cell-mouse-enter"],
  setup(props, { emit }) {
    index$1.useI18n();
    const isSameTime = (current, target) => {
      return date.methods.isSameWeek(current, target, props.dayStartOfWeek);
    };
    return {
      isSameTime,
      onSelect: (value) => {
        const startDateOfWeek = date.methods.startOfWeek(
          value,
          props.dayStartOfWeek
        );
        emit("select", startDateOfWeek);
      },
      onCellMouseEnter: (value) => {
        const startDateOfWeek = date.methods.startOfWeek(
          value,
          props.dayStartOfWeek
        );
        emit("cell-mouse-enter", startDateOfWeek);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DatePanel = vue.resolveComponent("DatePanel");
  return vue.openBlock(), vue.createBlock(_component_DatePanel, vue.mergeProps(_ctx.$attrs, {
    mode: "week",
    "is-week": "",
    "day-start-of-week": _ctx.dayStartOfWeek,
    "is-same-time": _ctx.isSameTime,
    onSelect: _ctx.onSelect,
    onCellMouseEnter: _ctx.onCellMouseEnter
  }), null, 16, ["day-start-of-week", "is-same-time", "onSelect", "onCellMouseEnter"]);
}
var WeekPanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = WeekPanel;
