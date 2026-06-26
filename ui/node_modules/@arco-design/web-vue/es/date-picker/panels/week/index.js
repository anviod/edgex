import { defineComponent, resolveComponent, openBlock, createBlock, mergeProps } from "vue";
import { methods } from "../../../_utils/date.js";
import DatePanel from "../date/index.js";
import { useI18n } from "../../../locale/index.js";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "WeekPanel",
  components: {
    DatePanel
  },
  props: {
    dayStartOfWeek: {
      type: Number,
      default: 0
    }
  },
  emits: ["select", "cell-mouse-enter"],
  setup(props, { emit }) {
    useI18n();
    const isSameTime = (current, target) => {
      return methods.isSameWeek(current, target, props.dayStartOfWeek);
    };
    return {
      isSameTime,
      onSelect: (value) => {
        const startDateOfWeek = methods.startOfWeek(
          value,
          props.dayStartOfWeek
        );
        emit("select", startDateOfWeek);
      },
      onCellMouseEnter: (value) => {
        const startDateOfWeek = methods.startOfWeek(
          value,
          props.dayStartOfWeek
        );
        emit("cell-mouse-enter", startDateOfWeek);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DatePanel = resolveComponent("DatePanel");
  return openBlock(), createBlock(_component_DatePanel, mergeProps(_ctx.$attrs, {
    mode: "week",
    "is-week": "",
    "day-start-of-week": _ctx.dayStartOfWeek,
    "is-same-time": _ctx.isSameTime,
    onSelect: _ctx.onSelect,
    onCellMouseEnter: _ctx.onCellMouseEnter
  }), null, 16, ["day-start-of-week", "is-same-time", "onSelect", "onCellMouseEnter"]);
}
var WeekPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { WeekPanel as default };
