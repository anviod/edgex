"use strict";
var vue = require("vue");
var globalConfig = require("../../../_utils/global-config.js");
var date = require("../../../_utils/date.js");
var index = require("../../utils/index.js");
var header = require("../header.js");
var body = require("../body.js");
var pluginVue_exportHelper = require("../../../_virtual/plugin-vue_export-helper.js");
const ROW_COUNT = 4;
const COL_COUNT = 3;
const CELL_COUNT = ROW_COUNT * COL_COUNT;
const SPAN = 10;
const _sfc_main = vue.defineComponent({
  name: "YearPanel",
  components: {
    PanelHeader: header,
    PanelBody: body
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
    const { headerValue } = vue.toRefs(props);
    const prefixCls = vue.computed(() => globalConfig.getPrefixCls("panel-year"));
    const pickerPrefixCls = globalConfig.getPrefixCls("picker");
    const rows = vue.computed(() => {
      const startYear = Math.floor(headerValue.value.year() / SPAN) * SPAN - 1;
      const flatData = index.newArray(CELL_COUNT).map((_, index2) => ({
        label: startYear + index2,
        value: date.dayjs(`${startYear + index2}`, "YYYY"),
        isPrev: index2 < 1,
        isNext: index2 > SPAN
      }));
      const rows2 = index.newArray(ROW_COUNT).map(
        (_, index2) => flatData.slice(index2 * COL_COUNT, (index2 + 1) * COL_COUNT)
      );
      return rows2;
    });
    const headerTitle = vue.computed(
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
  const _component_PanelHeader = vue.resolveComponent("PanelHeader");
  const _component_PanelBody = vue.resolveComponent("PanelBody");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      vue.createVNode(_component_PanelHeader, vue.mergeProps({
        ..._ctx.headerOperations,
        icons: _ctx.headerIcons
      }, {
        "prefix-cls": _ctx.pickerPrefixCls,
        title: _ctx.headerTitle
      }), null, 16, ["prefix-cls", "title"]),
      vue.createVNode(_component_PanelBody, {
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
var YearPanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = YearPanel;
