import { defineComponent, toRefs, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../../../_utils/global-config.js";
import { dayjs } from "../../../_utils/date.js";
import { newArray } from "../../utils/index.js";
import PanelHeader from "../header.js";
import PanelBody from "../body.js";
import useDatePickerTransform from "../../hooks/use-inject-datepicker-transform.js";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const MONTH_LIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const CELL_COUNT = 12;
const ROW_COUNT = 4;
const COL_COUNT = 3;
const _sfc_main = defineComponent({
  name: "MonthPanel",
  components: {
    PanelHeader,
    PanelBody
  },
  props: {
    headerValue: {
      type: Object,
      required: true
    },
    headerOperations: {
      type: Object,
      default: () => ({})
    },
    headerIcons: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object
    },
    disabledDate: {
      type: Function
    },
    rangeValues: {
      type: Array
    },
    dateRender: {
      type: Function
    },
    onHeaderLabelClick: {
      type: Function
    },
    abbreviation: {
      type: Boolean,
      default: true
    }
  },
  emits: ["select", "cell-mouse-enter"],
  setup(props, { emit }) {
    const datePickerT = useDatePickerTransform();
    const { headerValue } = toRefs(props);
    const prefixCls = computed(() => getPrefixCls("panel-month"));
    const pickerPrefixCls = getPrefixCls("picker");
    const headerTitle = computed(() => headerValue.value.format("YYYY"));
    const rows = computed(() => {
      const year = headerValue.value.year();
      const isAbbr = props.abbreviation ? "short" : "long";
      const flatData = newArray(CELL_COUNT).map((_, index) => ({
        label: datePickerT(`datePicker.month.${isAbbr}.${MONTH_LIST[index]}`),
        value: dayjs(`${year}-${index + 1}`, "YYYY-M")
      }));
      const rows2 = newArray(ROW_COUNT).map(
        (_, index) => flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT)
      );
      return rows2;
    });
    const isSameTime = (current, target) => current.isSame(target, "month");
    function onCellClick(cellData) {
      emit("select", cellData.value);
    }
    function onCellMouseEnter(cellData) {
      emit("cell-mouse-enter", cellData.value);
    }
    return {
      prefixCls,
      pickerPrefixCls,
      headerTitle,
      rows,
      isSameTime,
      onCellClick,
      onCellMouseEnter
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PanelHeader = resolveComponent("PanelHeader");
  const _component_PanelBody = resolveComponent("PanelBody");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      createVNode(_component_PanelHeader, mergeProps({
        ..._ctx.headerOperations,
        icons: _ctx.headerIcons
      }, {
        "prefix-cls": _ctx.pickerPrefixCls,
        title: _ctx.headerTitle,
        mode: "month",
        value: _ctx.headerValue,
        "on-label-click": _ctx.onHeaderLabelClick
      }), null, 16, ["prefix-cls", "title", "value", "on-label-click"]),
      createVNode(_component_PanelBody, {
        mode: "month",
        "prefix-cls": _ctx.pickerPrefixCls,
        rows: _ctx.rows,
        value: _ctx.value,
        "range-values": _ctx.rangeValues,
        "disabled-date": _ctx.disabledDate,
        "is-same-time": _ctx.isSameTime,
        "date-render": _ctx.dateRender,
        onCellClick: _ctx.onCellClick,
        onCellMouseEnter: _ctx.onCellMouseEnter
      }, null, 8, ["prefix-cls", "rows", "value", "range-values", "disabled-date", "is-same-time", "date-render", "onCellClick", "onCellMouseEnter"])
    ], 2)
  ], 2);
}
var MonthPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { MonthPanel as default };
