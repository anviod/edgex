"use strict";
var vue = require("vue");
var globalConfig = require("../../../_utils/global-config.js");
var date = require("../../../_utils/date.js");
var index$2 = require("../../utils/index.js");
var header = require("../header.js");
var body = require("../body.js");
var weekList = require("../week-list.js");
var panel = require("../../../time-picker/panel.js");
var index = require("../../../icon/icon-calendar/index.js");
var index$1 = require("../../../icon/icon-clock-circle/index.js");
var useMergeState = require("../../../_hooks/use-merge-state.js");
var useInjectDatepickerTransform = require("../../hooks/use-inject-datepicker-transform.js");
var pluginVue_exportHelper = require("../../../_virtual/plugin-vue_export-helper.js");
const ROW_COUNT = 6;
const COL_COUNT = 7;
const CELL_COUNT = ROW_COUNT * COL_COUNT;
function getCellData(time) {
  return {
    label: time.date(),
    value: time
  };
}
const _sfc_main = vue.defineComponent({
  name: "DatePanel",
  components: {
    PanelHeader: header,
    PanelBody: body,
    PanelWeekList: weekList,
    TimePanel: panel,
    IconCalendar: index,
    IconClockCircle: index$1
  },
  props: {
    isRange: {
      type: Boolean
    },
    value: {
      type: Object
    },
    rangeValues: {
      type: Array
    },
    headerValue: {
      type: Object,
      required: true
    },
    footerValue: {
      type: Object
    },
    timePickerValue: {
      type: Object
    },
    headerOperations: {
      type: Object,
      default: () => ({})
    },
    headerIcons: {
      type: Object,
      default: () => ({})
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    },
    disabledDate: {
      type: Function
    },
    disabledTime: {
      type: Function
    },
    isSameTime: {
      type: Function
    },
    mode: {
      type: String,
      default: "date"
    },
    showTime: {
      type: Boolean
    },
    timePickerProps: {
      type: Object
    },
    currentView: {
      type: String
    },
    dateRender: {
      type: Function
    },
    disabled: {
      type: Boolean
    },
    onHeaderLabelClick: {
      type: Function
    }
  },
  emits: [
    "select",
    "time-picker-select",
    "cell-mouse-enter",
    "current-view-change",
    "update:currentView"
  ],
  setup(props, { emit }) {
    const {
      isRange,
      headerValue,
      footerValue,
      dayStartOfWeek,
      isSameTime,
      mode,
      showTime,
      currentView,
      disabledTime
    } = vue.toRefs(props);
    const datePickerT = useInjectDatepickerTransform();
    const isWeek = vue.computed(() => (mode == null ? void 0 : mode.value) === "week");
    const prefixCls = vue.computed(
      () => globalConfig.getPrefixCls(isWeek.value ? "panel-week" : "panel-date")
    );
    const pickerPrefixCls = globalConfig.getPrefixCls("picker");
    const [localCurrentView, setLocalCurrentView] = useMergeState(
      "date",
      vue.reactive({ value: currentView })
    );
    const showViewTabs = vue.computed(() => showTime.value && isRange.value);
    const showDateView = vue.computed(
      () => !showTime.value || !showViewTabs.value || localCurrentView.value === "date"
    );
    const showTimeView = vue.computed(
      () => showTime.value && (!showViewTabs.value || localCurrentView.value === "time")
    );
    const classNames = vue.computed(() => [
      prefixCls.value,
      {
        [`${prefixCls.value}-with-view-tabs`]: showViewTabs.value
      }
    ]);
    const headerTitle = vue.computed(() => headerValue.value.format("YYYY-MM"));
    const disabledTimeProps = vue.computed(
      () => {
        var _a;
        return showTime.value && ((_a = disabledTime == null ? void 0 : disabledTime.value) == null ? void 0 : _a.call(
          disabledTime,
          date.getDateValue((footerValue == null ? void 0 : footerValue.value) || date.getNow())
        )) || {};
      }
    );
    const weekList2 = vue.computed(() => {
      const list = [0, 1, 2, 3, 4, 5, 6];
      const index2 = Math.max(dayStartOfWeek.value % 7, 0);
      return [...list.slice(index2), ...list.slice(0, index2)];
    });
    const rows = vue.computed(() => {
      const startDate = date.methods.startOf(headerValue.value, "month");
      const startDay = startDate.day();
      const days = startDate.daysInMonth();
      const startIndex = weekList2.value.indexOf(startDay);
      const flatData = index$2.newArray(CELL_COUNT);
      for (let i = 0; i < flatData.length; i++) {
        flatData[i] = {
          ...getCellData(date.methods.add(startDate, i - startIndex, "day")),
          isPrev: i < startIndex,
          isNext: i > startIndex + days - 1
        };
      }
      const rows2 = index$2.newArray(ROW_COUNT).map((_, index2) => {
        const row = flatData.slice(index2 * COL_COUNT, (index2 + 1) * COL_COUNT);
        if (isWeek.value) {
          const valueOfWeek = row[0].value;
          row.unshift({
            label: valueOfWeek.week(),
            value: valueOfWeek
          });
        }
        return row;
      });
      return rows2;
    });
    const mergedIsSameTime = vue.computed(
      () => (isSameTime == null ? void 0 : isSameTime.value) || ((current, target) => {
        return current.isSame(target, "day");
      })
    );
    function onCellClick(cellData) {
      emit("select", cellData.value);
    }
    function onTimePanelSelect(time) {
      emit("time-picker-select", time);
    }
    function onCellMouseEnter(cellData) {
      emit("cell-mouse-enter", cellData.value);
    }
    return {
      prefixCls,
      classNames,
      pickerPrefixCls,
      headerTitle,
      rows,
      weekList: vue.computed(
        () => isWeek.value ? [-1, ...weekList2.value] : weekList2.value
      ),
      mergedIsSameTime,
      disabledTimeProps,
      onCellClick,
      onCellMouseEnter,
      onTimePanelSelect,
      showViewTabs,
      showDateView,
      showTimeView,
      changeViewTo: (newView) => {
        emit("current-view-change", newView);
        emit("update:currentView", newView);
        setLocalCurrentView(newView);
      },
      datePickerT
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PanelHeader = vue.resolveComponent("PanelHeader");
  const _component_PanelWeekList = vue.resolveComponent("PanelWeekList");
  const _component_PanelBody = vue.resolveComponent("PanelBody");
  const _component_TimePanel = vue.resolveComponent("TimePanel");
  const _component_IconCalendar = vue.resolveComponent("IconCalendar");
  const _component_IconClockCircle = vue.resolveComponent("IconClockCircle");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    _ctx.showDateView ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      vue.createVNode(_component_PanelHeader, vue.mergeProps({
        ..._ctx.headerOperations,
        icons: _ctx.headerIcons
      }, {
        "prefix-cls": _ctx.pickerPrefixCls,
        title: _ctx.headerTitle,
        mode: _ctx.mode,
        value: _ctx.headerValue,
        "on-label-click": _ctx.onHeaderLabelClick
      }), null, 16, ["prefix-cls", "title", "mode", "value", "on-label-click"]),
      vue.createVNode(_component_PanelWeekList, {
        "prefix-cls": _ctx.pickerPrefixCls,
        "week-list": _ctx.weekList
      }, null, 8, ["prefix-cls", "week-list"]),
      vue.createVNode(_component_PanelBody, {
        mode: _ctx.mode,
        "prefix-cls": _ctx.pickerPrefixCls,
        rows: _ctx.rows,
        value: _ctx.isRange ? void 0 : _ctx.value,
        "range-values": _ctx.rangeValues,
        "disabled-date": _ctx.disabledDate,
        "is-same-time": _ctx.mergedIsSameTime,
        "date-render": _ctx.dateRender,
        onCellClick: _ctx.onCellClick,
        onCellMouseEnter: _ctx.onCellMouseEnter
      }, null, 8, ["mode", "prefix-cls", "rows", "value", "range-values", "disabled-date", "is-same-time", "date-render", "onCellClick", "onCellMouseEnter"])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.showTimeView ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-timepicker`)
    }, [
      vue.createElementVNode("header", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-timepicker-title`)
      }, vue.toDisplayString(_ctx.datePickerT("datePicker.selectTime")), 3),
      vue.createVNode(_component_TimePanel, vue.mergeProps({
        ..._ctx.timePickerProps,
        ..._ctx.disabledTimeProps
      }, {
        "hide-footer": "",
        value: _ctx.value || _ctx.isRange ? _ctx.timePickerValue : void 0,
        disabled: _ctx.disabled,
        onSelect: _ctx.onTimePanelSelect
      }), null, 16, ["value", "disabled", "onSelect"])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.showViewTabs ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-view-tabs`)
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass([
            `${_ctx.prefixCls}-view-tab-pane`,
            { [`${_ctx.prefixCls}-view-tab-pane-active`]: _ctx.showDateView }
          ]),
          onClick: _cache[0] || (_cache[0] = () => _ctx.changeViewTo("date"))
        }, [
          vue.createVNode(_component_IconCalendar),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-view-tab-pane-text`)
          }, vue.toDisplayString(_ctx.footerValue && _ctx.footerValue.format("YYYY-MM-DD")), 3)
        ], 2),
        vue.createElementVNode("div", {
          class: vue.normalizeClass([
            `${_ctx.prefixCls}-view-tab-pane`,
            { [`${_ctx.prefixCls}-view-tab-pane-active`]: _ctx.showTimeView }
          ]),
          onClick: _cache[1] || (_cache[1] = () => _ctx.changeViewTo("time"))
        }, [
          vue.createVNode(_component_IconClockCircle),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-view-tab-pane-text`)
          }, vue.toDisplayString(_ctx.timePickerValue && _ctx.timePickerValue.format("HH:mm:ss")), 3)
        ], 2)
      ], 2)
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var DatePanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DatePanel;
