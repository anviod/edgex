import { defineComponent, toRefs, computed, reactive, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, mergeProps, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../../../_utils/global-config.js";
import { getDateValue, getNow, methods } from "../../../_utils/date.js";
import { newArray } from "../../utils/index.js";
import PanelHeader from "../header.js";
import PanelBody from "../body.js";
import PanelWeekList from "../week-list.js";
import Panel from "../../../time-picker/panel.js";
import IconCalendar from "../../../icon/icon-calendar/index.js";
import IconClockCircle from "../../../icon/icon-clock-circle/index.js";
import useMergeState from "../../../_hooks/use-merge-state.js";
import useDatePickerTransform from "../../hooks/use-inject-datepicker-transform.js";
import _export_sfc from "../../../_virtual/plugin-vue_export-helper.js";
const ROW_COUNT = 6;
const COL_COUNT = 7;
const CELL_COUNT = ROW_COUNT * COL_COUNT;
function getCellData(time) {
  return {
    label: time.date(),
    value: time
  };
}
const _sfc_main = defineComponent({
  name: "DatePanel",
  components: {
    PanelHeader,
    PanelBody,
    PanelWeekList,
    TimePanel: Panel,
    IconCalendar,
    IconClockCircle
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
    } = toRefs(props);
    const datePickerT = useDatePickerTransform();
    const isWeek = computed(() => (mode == null ? void 0 : mode.value) === "week");
    const prefixCls = computed(
      () => getPrefixCls(isWeek.value ? "panel-week" : "panel-date")
    );
    const pickerPrefixCls = getPrefixCls("picker");
    const [localCurrentView, setLocalCurrentView] = useMergeState(
      "date",
      reactive({ value: currentView })
    );
    const showViewTabs = computed(() => showTime.value && isRange.value);
    const showDateView = computed(
      () => !showTime.value || !showViewTabs.value || localCurrentView.value === "date"
    );
    const showTimeView = computed(
      () => showTime.value && (!showViewTabs.value || localCurrentView.value === "time")
    );
    const classNames = computed(() => [
      prefixCls.value,
      {
        [`${prefixCls.value}-with-view-tabs`]: showViewTabs.value
      }
    ]);
    const headerTitle = computed(() => headerValue.value.format("YYYY-MM"));
    const disabledTimeProps = computed(
      () => {
        var _a;
        return showTime.value && ((_a = disabledTime == null ? void 0 : disabledTime.value) == null ? void 0 : _a.call(
          disabledTime,
          getDateValue((footerValue == null ? void 0 : footerValue.value) || getNow())
        )) || {};
      }
    );
    const weekList = computed(() => {
      const list = [0, 1, 2, 3, 4, 5, 6];
      const index = Math.max(dayStartOfWeek.value % 7, 0);
      return [...list.slice(index), ...list.slice(0, index)];
    });
    const rows = computed(() => {
      const startDate = methods.startOf(headerValue.value, "month");
      const startDay = startDate.day();
      const days = startDate.daysInMonth();
      const startIndex = weekList.value.indexOf(startDay);
      const flatData = newArray(CELL_COUNT);
      for (let i = 0; i < flatData.length; i++) {
        flatData[i] = {
          ...getCellData(methods.add(startDate, i - startIndex, "day")),
          isPrev: i < startIndex,
          isNext: i > startIndex + days - 1
        };
      }
      const rows2 = newArray(ROW_COUNT).map((_, index) => {
        const row = flatData.slice(index * COL_COUNT, (index + 1) * COL_COUNT);
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
    const mergedIsSameTime = computed(
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
      weekList: computed(
        () => isWeek.value ? [-1, ...weekList.value] : weekList.value
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
  const _component_PanelHeader = resolveComponent("PanelHeader");
  const _component_PanelWeekList = resolveComponent("PanelWeekList");
  const _component_PanelBody = resolveComponent("PanelBody");
  const _component_TimePanel = resolveComponent("TimePanel");
  const _component_IconCalendar = resolveComponent("IconCalendar");
  const _component_IconClockCircle = resolveComponent("IconClockCircle");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    _ctx.showDateView ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      createVNode(_component_PanelHeader, mergeProps({
        ..._ctx.headerOperations,
        icons: _ctx.headerIcons
      }, {
        "prefix-cls": _ctx.pickerPrefixCls,
        title: _ctx.headerTitle,
        mode: _ctx.mode,
        value: _ctx.headerValue,
        "on-label-click": _ctx.onHeaderLabelClick
      }), null, 16, ["prefix-cls", "title", "mode", "value", "on-label-click"]),
      createVNode(_component_PanelWeekList, {
        "prefix-cls": _ctx.pickerPrefixCls,
        "week-list": _ctx.weekList
      }, null, 8, ["prefix-cls", "week-list"]),
      createVNode(_component_PanelBody, {
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
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.showTimeView ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-timepicker`)
    }, [
      createElementVNode("header", {
        class: normalizeClass(`${_ctx.prefixCls}-timepicker-title`)
      }, toDisplayString(_ctx.datePickerT("datePicker.selectTime")), 3),
      createVNode(_component_TimePanel, mergeProps({
        ..._ctx.timePickerProps,
        ..._ctx.disabledTimeProps
      }, {
        "hide-footer": "",
        value: _ctx.value || _ctx.isRange ? _ctx.timePickerValue : void 0,
        disabled: _ctx.disabled,
        onSelect: _ctx.onTimePanelSelect
      }), null, 16, ["value", "disabled", "onSelect"])
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.showViewTabs ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-view-tabs`)
      }, [
        createElementVNode("div", {
          class: normalizeClass([
            `${_ctx.prefixCls}-view-tab-pane`,
            { [`${_ctx.prefixCls}-view-tab-pane-active`]: _ctx.showDateView }
          ]),
          onClick: _cache[0] || (_cache[0] = () => _ctx.changeViewTo("date"))
        }, [
          createVNode(_component_IconCalendar),
          createElementVNode("span", {
            class: normalizeClass(`${_ctx.prefixCls}-view-tab-pane-text`)
          }, toDisplayString(_ctx.footerValue && _ctx.footerValue.format("YYYY-MM-DD")), 3)
        ], 2),
        createElementVNode("div", {
          class: normalizeClass([
            `${_ctx.prefixCls}-view-tab-pane`,
            { [`${_ctx.prefixCls}-view-tab-pane-active`]: _ctx.showTimeView }
          ]),
          onClick: _cache[1] || (_cache[1] = () => _ctx.changeViewTo("time"))
        }, [
          createVNode(_component_IconClockCircle),
          createElementVNode("span", {
            class: normalizeClass(`${_ctx.prefixCls}-view-tab-pane-text`)
          }, toDisplayString(_ctx.timePickerValue && _ctx.timePickerValue.format("HH:mm:ss")), 3)
        ], 2)
      ], 2)
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var DatePanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DatePanel as default };
