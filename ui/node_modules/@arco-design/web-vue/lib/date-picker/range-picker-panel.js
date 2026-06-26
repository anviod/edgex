"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var date = require("../_utils/date.js");
var pick = require("../_utils/pick.js");
var shortcuts = require("./panels/shortcuts.js");
var footer = require("./panels/footer.js");
var index = require("./panels/date/index.js");
var index$1 = require("./panels/week/index.js");
var index$2 = require("./panels/month/index.js");
var index$3 = require("./panels/year/index.js");
var index$4 = require("./panels/quarter/index.js");
var renderFunction = require("../_components/render-function.js");
var index$5 = require("./utils/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "DateRangePikerPanel",
  components: {
    PanelShortcuts: shortcuts,
    PanelFooter: footer,
    RenderFunction: renderFunction,
    DatePanel: index,
    WeekPanel: index$1,
    MonthPanel: index$2,
    YearPanel: index$3,
    QuarterPanel: index$4
  },
  props: {
    mode: {
      type: String,
      default: "date"
    },
    value: {
      type: Array,
      default: () => []
    },
    footerValue: {
      type: Array
    },
    timePickerValue: {
      type: Array
    },
    showTime: {
      type: Boolean
    },
    showConfirmBtn: {
      type: Boolean
    },
    prefixCls: {
      type: String,
      required: true
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    shortcutsPosition: {
      type: String,
      default: "bottom"
    },
    format: {
      type: String,
      required: true
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
    timePickerProps: {
      type: Object
    },
    extra: {
      type: Function
    },
    dateRender: {
      type: Function
    },
    hideTrigger: {
      type: Boolean
    },
    startHeaderProps: {
      type: Object,
      default: () => ({})
    },
    endHeaderProps: {
      type: Object,
      default: () => ({})
    },
    confirmBtnDisabled: {
      type: Boolean
    },
    disabled: {
      type: Array,
      default: () => [false, false]
    },
    visible: {
      type: Boolean
    },
    startHeaderMode: {
      type: String
    },
    endHeaderMode: {
      type: String
    },
    abbreviation: {
      type: Boolean
    }
  },
  emits: [
    "cell-click",
    "cell-mouse-enter",
    "time-picker-select",
    "shortcut-click",
    "shortcut-mouse-enter",
    "shortcut-mouse-leave",
    "confirm",
    "start-header-label-click",
    "end-header-label-click",
    "start-header-select",
    "end-header-select"
  ],
  setup(props, { emit }) {
    const {
      prefixCls,
      shortcuts: shortcuts2,
      shortcutsPosition,
      format,
      hideTrigger,
      value,
      disabledDate,
      disabledTime,
      startHeaderProps,
      endHeaderProps,
      dateRender,
      visible,
      startHeaderMode,
      endHeaderMode
    } = vue.toRefs(props);
    const showShortcuts = vue.computed(
      () => is.isArray(shortcuts2.value) && shortcuts2.value.length
    );
    const classNames = vue.computed(() => [
      `${prefixCls.value}-range-container`,
      {
        [`${prefixCls.value}-range-container-panel-only`]: hideTrigger.value,
        [`${prefixCls.value}-range-container-shortcuts-placement-left`]: showShortcuts.value && shortcutsPosition.value === "left",
        [`${prefixCls.value}-range-container-shortcuts-placement-right`]: showShortcuts.value && shortcutsPosition.value === "right"
      }
    ]);
    const currentDateView = vue.ref("date");
    vue.watch(visible, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        currentDateView.value = "date";
      }
    });
    function getShortcutValue(shortcut) {
      return date.getDayjsValue(
        index$5.normalizeRangeValue(
          is.isFunction(shortcut.value) ? shortcut.value() : shortcut.value
        ),
        shortcut.format || format.value
      );
    }
    function onShortcutClick(shortcut) {
      emit("shortcut-click", getShortcutValue(shortcut), shortcut);
    }
    function onShortcutMouseEnter(shortcut) {
      emit("shortcut-mouse-enter", getShortcutValue(shortcut));
    }
    function onShortcutMouseLeave(shortcut) {
      emit("shortcut-mouse-leave", getShortcutValue(shortcut));
    }
    function onPanelCellClick(date2) {
      emit("cell-click", date2);
    }
    function onPanelCellMouseEnter(date2) {
      emit("cell-mouse-enter", date2);
    }
    function onConfirmBtnClick() {
      emit("confirm");
    }
    function onStartTimePickerSelect(time) {
      emit("time-picker-select", time, "start");
    }
    function onEndTimePickerSelect(time) {
      emit("time-picker-select", time, "end");
    }
    function onStartPanelHeaderLabelClick(type) {
      emit("start-header-label-click", type);
    }
    function onEndPanelHeaderLabelClick(type) {
      emit("end-header-label-click", type);
    }
    function onStartHeaderPanelSelect(date2) {
      emit("start-header-select", date2);
    }
    function onEndHeaderPanelSelect(date2) {
      emit("end-header-select", date2);
    }
    function getDisabledDateFunc(index2) {
      return is.isFunction(disabledDate == null ? void 0 : disabledDate.value) ? (current) => {
        var _a;
        return ((_a = disabledDate == null ? void 0 : disabledDate.value) == null ? void 0 : _a.call(disabledDate, current, index2 === 0 ? "start" : "end")) || false;
      } : void 0;
    }
    function getDisabledTimeFunc(index2) {
      return is.isFunction(disabledTime == null ? void 0 : disabledTime.value) ? (current) => {
        var _a;
        return ((_a = disabledTime == null ? void 0 : disabledTime.value) == null ? void 0 : _a.call(disabledTime, current, index2 === 0 ? "start" : "end")) || false;
      } : void 0;
    }
    function getDateRenderFunc(index2) {
      return is.isFunction(dateRender == null ? void 0 : dateRender.value) ? (props2) => {
        var _a;
        const mergeProps = {
          ...props2,
          type: index2 === 0 ? "start" : "end"
        };
        return (_a = dateRender == null ? void 0 : dateRender.value) == null ? void 0 : _a.call(dateRender, mergeProps);
      } : void 0;
    }
    const shortcutsProps = vue.reactive({
      prefixCls,
      shortcuts: shortcuts2,
      onItemClick: onShortcutClick,
      onItemMouseEnter: onShortcutMouseEnter,
      onItemMouseLeave: onShortcutMouseLeave
    });
    const startPanelProps = vue.computed(() => ({
      ...startHeaderProps.value,
      rangeValues: value.value,
      disabledDate: getDisabledDateFunc(0),
      dateRender: getDateRenderFunc(0),
      onSelect: startHeaderMode.value ? onStartHeaderPanelSelect : onPanelCellClick,
      onCellMouseEnter: onPanelCellMouseEnter,
      onHeaderLabelClick: onStartPanelHeaderLabelClick
    }));
    const endPanelProps = vue.computed(() => ({
      ...endHeaderProps.value,
      rangeValues: value.value,
      disabledDate: getDisabledDateFunc(1),
      dateRender: getDateRenderFunc(1),
      onSelect: endHeaderMode.value ? onEndHeaderPanelSelect : onPanelCellClick,
      onCellMouseEnter: onPanelCellMouseEnter,
      onHeaderLabelClick: onEndPanelHeaderLabelClick
    }));
    return {
      pick,
      classNames,
      showShortcuts,
      shortcutsProps,
      startPanelProps,
      endPanelProps,
      getDisabledTimeFunc,
      onConfirmBtnClick,
      currentDateView,
      onStartTimePickerSelect,
      onEndTimePickerSelect,
      onStartHeaderPanelSelect,
      onEndHeaderPanelSelect
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PanelShortcuts = vue.resolveComponent("PanelShortcuts");
  const _component_YearPanel = vue.resolveComponent("YearPanel");
  const _component_MonthPanel = vue.resolveComponent("MonthPanel");
  const _component_WeekPanel = vue.resolveComponent("WeekPanel");
  const _component_QuarterPanel = vue.resolveComponent("QuarterPanel");
  const _component_DatePanel = vue.resolveComponent("DatePanel");
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  const _component_PanelFooter = vue.resolveComponent("PanelFooter");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    _ctx.showShortcuts && _ctx.shortcutsPosition === "left" ? (vue.openBlock(), vue.createBlock(_component_PanelShortcuts, vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.shortcutsProps)), null, 16)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-range-panel-wrapper`)
    }, [
      vue.createCommentVNode(" panel "),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-range`)
      }, [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-range-wrapper`)
        }, [
          _ctx.startHeaderMode || _ctx.endHeaderMode ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            _ctx.startHeaderMode === "year" ? (vue.openBlock(), vue.createBlock(_component_YearPanel, vue.normalizeProps(vue.mergeProps({ key: 0 }, _ctx.startPanelProps)), null, 16)) : vue.createCommentVNode("v-if", true),
            _ctx.endHeaderMode === "year" ? (vue.openBlock(), vue.createBlock(_component_YearPanel, vue.normalizeProps(vue.mergeProps({ key: 1 }, _ctx.endPanelProps)), null, 16)) : _ctx.startHeaderMode === "month" ? (vue.openBlock(), vue.createBlock(_component_MonthPanel, vue.mergeProps({ key: 2 }, _ctx.startPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])) : _ctx.endHeaderMode === "month" ? (vue.openBlock(), vue.createBlock(_component_MonthPanel, vue.mergeProps({ key: 3 }, _ctx.endPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])) : vue.createCommentVNode("v-if", true)
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createCommentVNode(" week "),
            _ctx.mode === "week" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              vue.createVNode(_component_WeekPanel, vue.mergeProps(_ctx.startPanelProps, { "day-start-of-week": _ctx.dayStartOfWeek }), null, 16, ["day-start-of-week"]),
              vue.createVNode(_component_WeekPanel, vue.mergeProps(_ctx.endPanelProps, { "day-start-of-week": _ctx.dayStartOfWeek }), null, 16, ["day-start-of-week"])
            ], 64)) : _ctx.mode === "month" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
              vue.createCommentVNode(" month "),
              vue.createVNode(_component_MonthPanel, vue.mergeProps(_ctx.startPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"]),
              vue.createVNode(_component_MonthPanel, vue.mergeProps(_ctx.endPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])
            ], 64)) : _ctx.mode === "year" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
              vue.createCommentVNode(" year "),
              vue.createVNode(_component_YearPanel, vue.normalizeProps(vue.guardReactiveProps(_ctx.startPanelProps)), null, 16),
              vue.createVNode(_component_YearPanel, vue.normalizeProps(vue.guardReactiveProps(_ctx.endPanelProps)), null, 16)
            ], 64)) : _ctx.mode === "quarter" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
              vue.createCommentVNode(" quarter "),
              vue.createVNode(_component_QuarterPanel, vue.normalizeProps(vue.guardReactiveProps(_ctx.startPanelProps)), null, 16),
              vue.createVNode(_component_QuarterPanel, vue.normalizeProps(vue.guardReactiveProps(_ctx.endPanelProps)), null, 16)
            ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 4 }, [
              vue.createCommentVNode(" date "),
              vue.createVNode(_component_DatePanel, vue.mergeProps({
                currentView: _ctx.currentDateView,
                "onUpdate:currentView": _cache[0] || (_cache[0] = ($event) => _ctx.currentDateView = $event)
              }, _ctx.startPanelProps, {
                "is-range": "",
                value: _ctx.value && _ctx.value[0],
                "footer-value": _ctx.footerValue && _ctx.footerValue[0],
                "time-picker-value": _ctx.timePickerValue && _ctx.timePickerValue[0],
                "day-start-of-week": _ctx.dayStartOfWeek,
                "show-time": _ctx.showTime,
                "time-picker-props": _ctx.timePickerProps,
                "disabled-time": _ctx.getDisabledTimeFunc(0),
                disabled: _ctx.disabled[0],
                onTimePickerSelect: _ctx.onStartTimePickerSelect
              }), null, 16, ["currentView", "value", "footer-value", "time-picker-value", "day-start-of-week", "show-time", "time-picker-props", "disabled-time", "disabled", "onTimePickerSelect"]),
              vue.createVNode(_component_DatePanel, vue.mergeProps({
                currentView: _ctx.currentDateView,
                "onUpdate:currentView": _cache[1] || (_cache[1] = ($event) => _ctx.currentDateView = $event)
              }, _ctx.endPanelProps, {
                "is-range": "",
                value: _ctx.value && _ctx.value[1],
                "footer-value": _ctx.footerValue && _ctx.footerValue[1],
                "time-picker-value": _ctx.timePickerValue && _ctx.timePickerValue[1],
                "day-start-of-week": _ctx.dayStartOfWeek,
                "show-time": _ctx.showTime,
                "time-picker-props": _ctx.timePickerProps,
                "disabled-time": _ctx.getDisabledTimeFunc(1),
                disabled: _ctx.disabled[1],
                onTimePickerSelect: _ctx.onEndTimePickerSelect
              }), null, 16, ["currentView", "value", "footer-value", "time-picker-value", "day-start-of-week", "show-time", "time-picker-props", "disabled-time", "disabled", "onTimePickerSelect"])
            ], 64))
          ], 64))
        ], 2)
      ], 2),
      vue.createCommentVNode(" footer "),
      vue.createVNode(_component_PanelFooter, {
        "prefix-cls": _ctx.prefixCls,
        "show-today-btn": false,
        "show-confirm-btn": _ctx.showConfirmBtn,
        "confirm-btn-disabled": _ctx.confirmBtnDisabled,
        onConfirmBtnClick: _ctx.onConfirmBtnClick
      }, vue.createSlots({ _: 2 }, [
        _ctx.extra || _ctx.$slots.extra ? {
          name: "extra",
          fn: vue.withCtx(() => [
            _ctx.$slots.extra ? vue.renderSlot(_ctx.$slots, "extra", { key: 0 }) : (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
              key: 1,
              "render-func": _ctx.extra
            }, null, 8, ["render-func"]))
          ]),
          key: "0"
        } : void 0,
        _ctx.showShortcuts && _ctx.shortcutsPosition === "bottom" ? {
          name: "btn",
          fn: vue.withCtx(() => [
            vue.createVNode(_component_PanelShortcuts, vue.normalizeProps(vue.guardReactiveProps(_ctx.shortcutsProps)), null, 16)
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "show-confirm-btn", "confirm-btn-disabled", "onConfirmBtnClick"])
    ], 2),
    _ctx.showShortcuts && _ctx.shortcutsPosition === "right" ? (vue.openBlock(), vue.createBlock(_component_PanelShortcuts, vue.normalizeProps(vue.mergeProps({ key: 1 }, _ctx.shortcutsProps)), null, 16)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var RangePickerPanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = RangePickerPanel;
