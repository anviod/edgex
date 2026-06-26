import { defineComponent, toRefs, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../../../_utils/global-config.js";
import { dayjs } from "../../../_utils/date.js";
import { newArray } from "../../utils/index.js";
import PanelHeader from "../header.js";
import PanelBody from "../body.js";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const ROW_COUNT = 4;
const COL_COUNT = 3;
const CELL_COUNT = ROW_COUNT * COL_COUNT;
const SPAN = 10;
const _sfc_main = defineComponent({
  name: "YearPanel",
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
    }
  },
  emits: ["select", "cell-mouse-enter"],
  setup(props, { emit }) {
    const { headerValue } = toRefs(props);
    const prefixCls = computed(() => getPrefixCls("panel-year"));
    const pickerPrefixCls = getPrefixCls("picker");
    const rows = computed(() => {
      const startYear = Math.floor(headerValue.value.year() / SPAN) * SPAN - 1;
      const flatData = newArray(CELL_COUNT).map((_, index) => ({
        label: startYear + index,
        value: dayjs(`${startYear + index}`, "YYYY"),
        isPrev: index < 1,
        isNext: index > SPAN
      }));
      const rows2 = newArray(ROW_COUNT).map(
        (_, index) => flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT)
      );
      return rows2;
    });
    const headerTitle = computed(
      () => `${rows.value[0][1].label}-${rows.value[ROW_COUNT - 1][COL_COUNT - 1].label}`
    );
    const isSameTime = (current, target) => current.isSame(target, "year");
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
        title: _ctx.headerTitle
      }), null, 16, ["prefix-cls", "title"]),
      createVNode(_component_PanelBody, {
        mode: "year",
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
var YearPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { YearPanel as default };
