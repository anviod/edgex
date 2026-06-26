import { defineComponent, toRefs, computed, ref, watch, reactive, resolveComponent, openBlock, createElementBlock, normalizeClass, createBlock, normalizeProps, mergeProps, createCommentVNode, createElementVNode, Fragment, createVNode, guardReactiveProps, createSlots, withCtx, renderSlot } from "vue";
import { isArray, isFunction } from "../_utils/is.js";
import { getDayjsValue } from "../_utils/date.js";
import pick from "../_utils/pick.js";
import PanelShortcuts from "./panels/shortcuts.js";
import PanelFooter from "./panels/footer.js";
import DatePanel from "./panels/date/index.js";
import WeekPanel from "./panels/week/index.js";
import MonthPanel from "./panels/month/index.js";
import YearPanel from "./panels/year/index.js";
import QuarterPanel from "./panels/quarter/index.js";
import RenderFunction from "../_components/render-function.js";
import { normalizeRangeValue } from "./utils/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "DateRangePikerPanel",
  components: {
    PanelShortcuts,
    PanelFooter,
    RenderFunction,
    DatePanel,
    WeekPanel,
    MonthPanel,
    YearPanel,
    QuarterPanel
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
      shortcuts,
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
    } = toRefs(props);
    const showShortcuts = computed(
      () => isArray(shortcuts.value) && shortcuts.value.length
    );
    const classNames = computed(() => [
      `${prefixCls.value}-range-container`,
      {
        [`${prefixCls.value}-range-container-panel-only`]: hideTrigger.value,
        [`${prefixCls.value}-range-container-shortcuts-placement-left`]: showShortcuts.value && shortcutsPosition.value === "left",
        [`${prefixCls.value}-range-container-shortcuts-placement-right`]: showShortcuts.value && shortcutsPosition.value === "right"
      }
    ]);
    const currentDateView = ref("date");
    watch(visible, (newVal, oldVal) => {
      if (newVal && !oldVal) {
        currentDateView.value = "date";
      }
    });
    function getShortcutValue(shortcut) {
      return getDayjsValue(
        normalizeRangeValue(
          isFunction(shortcut.value) ? shortcut.value() : shortcut.value
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
    function onPanelCellClick(date) {
      emit("cell-click", date);
    }
    function onPanelCellMouseEnter(date) {
      emit("cell-mouse-enter", date);
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
    function onStartHeaderPanelSelect(date) {
      emit("start-header-select", date);
    }
    function onEndHeaderPanelSelect(date) {
      emit("end-header-select", date);
    }
    function getDisabledDateFunc(index) {
      return isFunction(disabledDate == null ? void 0 : disabledDate.value) ? (current) => {
        var _a;
        return ((_a = disabledDate == null ? void 0 : disabledDate.value) == null ? void 0 : _a.call(disabledDate, current, index === 0 ? "start" : "end")) || false;
      } : void 0;
    }
    function getDisabledTimeFunc(index) {
      return isFunction(disabledTime == null ? void 0 : disabledTime.value) ? (current) => {
        var _a;
        return ((_a = disabledTime == null ? void 0 : disabledTime.value) == null ? void 0 : _a.call(disabledTime, current, index === 0 ? "start" : "end")) || false;
      } : void 0;
    }
    function getDateRenderFunc(index) {
      return isFunction(dateRender == null ? void 0 : dateRender.value) ? (props2) => {
        var _a;
        const mergeProps2 = {
          ...props2,
          type: index === 0 ? "start" : "end"
        };
        return (_a = dateRender == null ? void 0 : dateRender.value) == null ? void 0 : _a.call(dateRender, mergeProps2);
      } : void 0;
    }
    const shortcutsProps = reactive({
      prefixCls,
      shortcuts,
      onItemClick: onShortcutClick,
      onItemMouseEnter: onShortcutMouseEnter,
      onItemMouseLeave: onShortcutMouseLeave
    });
    const startPanelProps = computed(() => ({
      ...startHeaderProps.value,
      rangeValues: value.value,
      disabledDate: getDisabledDateFunc(0),
      dateRender: getDateRenderFunc(0),
      onSelect: startHeaderMode.value ? onStartHeaderPanelSelect : onPanelCellClick,
      onCellMouseEnter: onPanelCellMouseEnter,
      onHeaderLabelClick: onStartPanelHeaderLabelClick
    }));
    const endPanelProps = computed(() => ({
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
  const _component_PanelShortcuts = resolveComponent("PanelShortcuts");
  const _component_YearPanel = resolveComponent("YearPanel");
  const _component_MonthPanel = resolveComponent("MonthPanel");
  const _component_WeekPanel = resolveComponent("WeekPanel");
  const _component_QuarterPanel = resolveComponent("QuarterPanel");
  const _component_DatePanel = resolveComponent("DatePanel");
  const _component_RenderFunction = resolveComponent("RenderFunction");
  const _component_PanelFooter = resolveComponent("PanelFooter");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    _ctx.showShortcuts && _ctx.shortcutsPosition === "left" ? (openBlock(), createBlock(_component_PanelShortcuts, normalizeProps(mergeProps({ key: 0 }, _ctx.shortcutsProps)), null, 16)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-range-panel-wrapper`)
    }, [
      createCommentVNode(" panel "),
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-range`)
      }, [
        createElementVNode("div", {
          class: normalizeClass(`${_ctx.prefixCls}-range-wrapper`)
        }, [
          _ctx.startHeaderMode || _ctx.endHeaderMode ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
            _ctx.startHeaderMode === "year" ? (openBlock(), createBlock(_component_YearPanel, normalizeProps(mergeProps({ key: 0 }, _ctx.startPanelProps)), null, 16)) : createCommentVNode("v-if", true),
            _ctx.endHeaderMode === "year" ? (openBlock(), createBlock(_component_YearPanel, normalizeProps(mergeProps({ key: 1 }, _ctx.endPanelProps)), null, 16)) : _ctx.startHeaderMode === "month" ? (openBlock(), createBlock(_component_MonthPanel, mergeProps({ key: 2 }, _ctx.startPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])) : _ctx.endHeaderMode === "month" ? (openBlock(), createBlock(_component_MonthPanel, mergeProps({ key: 3 }, _ctx.endPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])) : createCommentVNode("v-if", true)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createCommentVNode(" week "),
            _ctx.mode === "week" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createVNode(_component_WeekPanel, mergeProps(_ctx.startPanelProps, { "day-start-of-week": _ctx.dayStartOfWeek }), null, 16, ["day-start-of-week"]),
              createVNode(_component_WeekPanel, mergeProps(_ctx.endPanelProps, { "day-start-of-week": _ctx.dayStartOfWeek }), null, 16, ["day-start-of-week"])
            ], 64)) : _ctx.mode === "month" ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createCommentVNode(" month "),
              createVNode(_component_MonthPanel, mergeProps(_ctx.startPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"]),
              createVNode(_component_MonthPanel, mergeProps(_ctx.endPanelProps, { abbreviation: _ctx.abbreviation }), null, 16, ["abbreviation"])
            ], 64)) : _ctx.mode === "year" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
              createCommentVNode(" year "),
              createVNode(_component_YearPanel, normalizeProps(guardReactiveProps(_ctx.startPanelProps)), null, 16),
              createVNode(_component_YearPanel, normalizeProps(guardReactiveProps(_ctx.endPanelProps)), null, 16)
            ], 64)) : _ctx.mode === "quarter" ? (openBlock(), createElementBlock(Fragment, { key: 3 }, [
              createCommentVNode(" quarter "),
              createVNode(_component_QuarterPanel, normalizeProps(guardReactiveProps(_ctx.startPanelProps)), null, 16),
              createVNode(_component_QuarterPanel, normalizeProps(guardReactiveProps(_ctx.endPanelProps)), null, 16)
            ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 4 }, [
              createCommentVNode(" date "),
              createVNode(_component_DatePanel, mergeProps({
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
              createVNode(_component_DatePanel, mergeProps({
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
      createCommentVNode(" footer "),
      createVNode(_component_PanelFooter, {
        "prefix-cls": _ctx.prefixCls,
        "show-today-btn": false,
        "show-confirm-btn": _ctx.showConfirmBtn,
        "confirm-btn-disabled": _ctx.confirmBtnDisabled,
        onConfirmBtnClick: _ctx.onConfirmBtnClick
      }, createSlots({ _: 2 }, [
        _ctx.extra || _ctx.$slots.extra ? {
          name: "extra",
          fn: withCtx(() => [
            _ctx.$slots.extra ? renderSlot(_ctx.$slots, "extra", { key: 0 }) : (openBlock(), createBlock(_component_RenderFunction, {
              key: 1,
              "render-func": _ctx.extra
            }, null, 8, ["render-func"]))
          ]),
          key: "0"
        } : void 0,
        _ctx.showShortcuts && _ctx.shortcutsPosition === "bottom" ? {
          name: "btn",
          fn: withCtx(() => [
            createVNode(_component_PanelShortcuts, normalizeProps(guardReactiveProps(_ctx.shortcutsProps)), null, 16)
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "show-confirm-btn", "confirm-btn-disabled", "onConfirmBtnClick"])
    ], 2),
    _ctx.showShortcuts && _ctx.shortcutsPosition === "right" ? (openBlock(), createBlock(_component_PanelShortcuts, normalizeProps(mergeProps({ key: 1 }, _ctx.shortcutsProps)), null, 16)) : createCommentVNode("v-if", true)
  ], 2);
}
var RangePickerPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { RangePickerPanel as default };
