"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var pick = require("../_utils/pick.js");
var index$3 = require("../time-picker/utils/index.js");
var date = require("../_utils/date.js");
var useState = require("../_hooks/use-state.js");
var index$4 = require("./utils/index.js");
var useFormat = require("./hooks/use-format.js");
var useRangePickerState = require("./hooks/use-range-picker-state.js");
var useRangeHeaderValue = require("./hooks/use-range-header-value.js");
var index = require("../trigger/index.js");
var inputRange = require("../_components/picker/input-range.js");
var rangePickerPanel = require("./range-picker-panel.js");
var useRangeTimePickerValue = require("./hooks/use-range-time-picker-value.js");
var useIsDisabledDate = require("./hooks/use-is-disabled-date.js");
var omit = require("../_utils/omit.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var index$1 = require("../icon/icon-calendar/index.js");
var useProvideDatepickerTransform = require("./hooks/use-provide-datepicker-transform.js");
var useValueFormat = require("./hooks/use-value-format.js");
var useFormItem = require("../_hooks/use-form-item.js");
var index$2 = require("../locale/index.js");
var context = require("../config-provider/context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "RangePicker",
  components: {
    RangePickerPanel: rangePickerPanel,
    DateRangeInput: inputRange,
    Trigger: index,
    IconCalendar: index$1
  },
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: "date"
    },
    modelValue: {
      type: Array
    },
    defaultValue: {
      type: Array
    },
    pickerValue: {
      type: Array
    },
    defaultPickerValue: {
      type: Array
    },
    disabled: {
      type: [Boolean, Array],
      default: false
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    },
    format: {
      type: String
    },
    valueFormat: {
      type: String
    },
    showTime: {
      type: Boolean
    },
    timePickerProps: {
      type: Object
    },
    placeholder: {
      type: Array
    },
    disabledDate: {
      type: Function
    },
    disabledTime: {
      type: Function
    },
    separator: {
      type: String
    },
    exchangeTime: {
      type: Boolean,
      default: true
    },
    popupContainer: {
      type: [String, Object]
    },
    locale: {
      type: Object
    },
    hideTrigger: {
      type: Boolean
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    size: {
      type: String
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    shortcutsPosition: {
      type: String,
      default: "bottom"
    },
    position: {
      type: String,
      default: "bl"
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean
    },
    triggerProps: {
      type: Object
    },
    unmountOnClose: {
      type: Boolean
    },
    previewShortcut: {
      type: Boolean,
      default: true
    },
    showConfirmBtn: {
      type: Boolean
    },
    disabledInput: {
      type: Boolean,
      default: false
    },
    abbreviation: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "change": (value, date2, dateString) => {
      return true;
    },
    "update:modelValue": (value) => {
      return true;
    },
    "select": (value, date2, dateString) => {
      return true;
    },
    "popup-visible-change": (visible) => {
      return true;
    },
    "update:popupVisible": (visible) => {
      return true;
    },
    "ok": (value, date2, dateString) => {
      return true;
    },
    "clear": () => {
      return true;
    },
    "select-shortcut": (shortcut) => {
      return true;
    },
    "picker-value-change": (value, date2, dateString) => {
      return true;
    },
    "update:pickerValue": (value) => {
      return true;
    }
  },
  setup(props, { emit, slots }) {
    const {
      mode,
      showTime,
      format,
      modelValue,
      defaultValue,
      popupVisible,
      defaultPopupVisible,
      placeholder,
      timePickerProps,
      disabled,
      disabledDate,
      disabledTime,
      locale,
      pickerValue,
      defaultPickerValue,
      valueFormat,
      size,
      error,
      dayStartOfWeek,
      exchangeTime,
      previewShortcut,
      showConfirmBtn
    } = vue.toRefs(props);
    const { locale: globalLocal } = index$2.useI18n();
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    vue.watchEffect(() => {
      date.initializeDateLocale(globalLocal.value, dayStartOfWeek.value);
    });
    const mergedExchangeTime = vue.computed(() => {
      var _a;
      return !(!exchangeTime.value || !((_a = configCtx == null ? void 0 : configCtx.exchangeTime) != null ? _a : true));
    });
    const {
      mergedSize,
      mergedDisabled: formDisabled,
      mergedError,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      error
    });
    const datePickerT = useProvideDatepickerTransform(
      vue.reactive({
        locale
      })
    );
    const prefixCls = globalConfig.getPrefixCls("picker");
    const computedPlaceholder = vue.computed(
      () => (placeholder == null ? void 0 : placeholder.value) || {
        date: datePickerT("datePicker.rangePlaceholder.date"),
        month: datePickerT("datePicker.rangePlaceholder.month"),
        year: datePickerT("datePicker.rangePlaceholder.year"),
        week: datePickerT("datePicker.rangePlaceholder.week"),
        quarter: datePickerT("datePicker.rangePlaceholder.quarter")
      }[mode.value] || datePickerT("datePicker.rangePlaceholder.date")
    );
    const {
      format: computedFormat,
      valueFormat: returnValueFormat,
      parseValueFormat
    } = useFormat["default"](
      vue.reactive({
        mode,
        format,
        showTime,
        valueFormat
      })
    );
    const disabledArray = vue.computed(() => {
      const disabled0 = disabled.value === true || formDisabled.value || is.isArray(disabled.value) && disabled.value[0] === true;
      const disabled1 = disabled.value === true || formDisabled.value || is.isArray(disabled.value) && disabled.value[1] === true;
      return [disabled0, disabled1];
    });
    const triggerDisabled = vue.computed(
      () => disabledArray.value[0] && disabledArray.value[1]
    );
    function getFocusedIndex(cur = 0) {
      return disabledArray.value[cur] ? cur ^ 1 : cur;
    }
    const refInput = vue.ref();
    const focusedIndex = vue.ref(getFocusedIndex());
    const nextFocusedIndex = vue.computed(() => {
      const cur = focusedIndex.value;
      const next = cur ^ 1;
      return disabledArray.value[next] ? cur : next;
    });
    const isNextDisabled = vue.computed(
      () => disabledArray.value[focusedIndex.value ^ 1]
    );
    const { value: selectedValue, setValue: setSelectedValue } = useRangePickerState(
      vue.reactive({
        modelValue,
        defaultValue,
        format: parseValueFormat
      })
    );
    const [processValue, setProcessValue] = useState();
    const [previewValue, setPreviewValue] = useState();
    const forSelectedValue = vue.computed(
      () => {
        var _a;
        return (_a = processValue.value) != null ? _a : selectedValue.value;
      }
    );
    const panelValue = vue.computed(
      () => {
        var _a, _b;
        return (_b = (_a = previewValue.value) != null ? _a : processValue.value) != null ? _b : selectedValue.value;
      }
    );
    const [inputValue, setInputValue] = useState();
    const startHeaderMode = vue.ref();
    const endHeaderMode = vue.ref();
    const [panelVisible, setLocalPanelVisible] = useMergeState(
      defaultPopupVisible.value,
      vue.reactive({ value: popupVisible })
    );
    const setPanelVisible = (newVisible) => {
      if (panelVisible.value !== newVisible) {
        setLocalPanelVisible(newVisible);
        emit("popup-visible-change", newVisible);
        emit("update:popupVisible", newVisible);
      }
    };
    const {
      startHeaderValue,
      endHeaderValue,
      startHeaderOperations,
      endHeaderOperations,
      resetHeaderValue,
      setHeaderValue
    } = useRangeHeaderValue(
      vue.reactive({
        mode,
        startHeaderMode,
        endHeaderMode,
        value: pickerValue,
        defaultValue: defaultPickerValue,
        selectedValue: panelValue,
        format: parseValueFormat,
        onChange: (newVal) => {
          const returnValue = useValueFormat.getReturnRangeValue(
            newVal,
            returnValueFormat.value
          );
          const formattedValue = index$3.getFormattedValue(
            newVal,
            parseValueFormat.value
          );
          const dateValue = date.getDateValue(newVal);
          emit("picker-value-change", returnValue, dateValue, formattedValue);
          emit("update:pickerValue", returnValue);
        }
      })
    );
    function onStartPanelHeaderLabelClick(type) {
      startHeaderMode.value = type;
    }
    function onEndPanelHeaderLabelClick(type) {
      endHeaderMode.value = type;
    }
    function onStartPanelHeaderSelect(date2) {
      let newStartValue = startHeaderValue.value;
      newStartValue = newStartValue.set("year", date2.year());
      if (startHeaderMode.value === "month") {
        newStartValue = newStartValue.set("month", date2.month());
      }
      setHeaderValue([newStartValue, endHeaderValue.value]);
      startHeaderMode.value = void 0;
    }
    function onEndPanelHeaderSelect(date2) {
      let newEndValue = endHeaderValue.value;
      newEndValue = newEndValue.set("year", date2.year());
      if (endHeaderMode.value === "month") {
        newEndValue = newEndValue.set("month", date2.month());
      }
      setHeaderValue([startHeaderValue.value, newEndValue]);
      endHeaderMode.value = void 0;
    }
    const footerValue = vue.ref([
      panelValue.value[0] || date.getNow(),
      panelValue.value[1] || date.getNow()
    ]);
    vue.watch(panelValue, () => {
      const [value0, value1] = panelValue.value;
      footerValue.value[0] = value0 || footerValue.value[0];
      footerValue.value[1] = value1 || footerValue.value[1];
    });
    const [timePickerValue, setTimePickerValue, resetTimePickerValue] = useRangeTimePickerValue(
      vue.reactive({
        timePickerProps,
        selectedValue: panelValue
      })
    );
    const isDateTime = vue.computed(() => mode.value === "date" && showTime.value);
    const hasTime = vue.computed(() => isDateTime.value || timePickerProps.value);
    const isDisabledDate = useIsDisabledDate(
      vue.reactive({
        mode,
        isRange: true,
        showTime,
        disabledDate,
        disabledTime
      })
    );
    const needConfirm = vue.computed(
      () => isDateTime.value || showConfirmBtn.value
    );
    const confirmBtnDisabled = vue.computed(
      () => needConfirm.value && (!index$4.isCompleteRangeValue(forSelectedValue.value) || isDisabledDate(forSelectedValue.value[0], "start") || isDisabledDate(forSelectedValue.value[1], "end"))
    );
    vue.watch(panelVisible, (newVisible) => {
      startHeaderMode.value = void 0;
      endHeaderMode.value = void 0;
      setProcessValue(void 0);
      setPreviewValue(void 0);
      if (newVisible) {
        resetHeaderValue();
        resetTimePickerValue();
        focusedIndex.value = getFocusedIndex(focusedIndex.value);
        vue.nextTick(() => focusInput(focusedIndex.value));
      }
      if (!newVisible) {
        setInputValue(void 0);
      }
    });
    vue.watch(focusedIndex, () => {
      if (props.disabledInput) {
        focusInput(focusedIndex.value);
        setInputValue(void 0);
      }
    });
    function emitChange(value, emitOk) {
      var _a, _b;
      const returnValue = value ? useValueFormat.getReturnRangeValue(value, returnValueFormat.value) : void 0;
      const formattedValue = index$3.getFormattedValue(value, parseValueFormat.value);
      const dateValue = date.getDateValue(value);
      if (date.isValueChange(value, selectedValue.value)) {
        emit("update:modelValue", returnValue);
        emit("change", returnValue, dateValue, formattedValue);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      }
      if (emitOk) {
        emit("ok", returnValue, dateValue, formattedValue);
      }
    }
    function getSortedDayjsArrayByExchangeTimeOrNot(newValue) {
      let sortedValue = date.getSortedDayjsArray(newValue);
      if (hasTime.value && !mergedExchangeTime.value) {
        sortedValue = [
          getMergedOpValue(sortedValue[0], newValue[0]),
          getMergedOpValue(sortedValue[1], newValue[1])
        ];
      }
      return sortedValue;
    }
    function confirm(value, showPanel, emitOk) {
      if (isDisabledDate(value == null ? void 0 : value[0], "start") || isDisabledDate(value == null ? void 0 : value[1], "end")) {
        return;
      }
      let newValue = value ? [...value] : void 0;
      if (index$4.isCompleteRangeValue(newValue)) {
        newValue = getSortedDayjsArrayByExchangeTimeOrNot(newValue);
      }
      emitChange(newValue, emitOk);
      setSelectedValue(newValue || []);
      setProcessValue(void 0);
      setPreviewValue(void 0);
      setInputValue(void 0);
      startHeaderMode.value = void 0;
      endHeaderMode.value = void 0;
      if (is.isBoolean(showPanel)) {
        setPanelVisible(showPanel);
      }
    }
    function emitSelectEvent(value) {
      const returnValue = useValueFormat.getReturnRangeValue(value, returnValueFormat.value);
      const formattedValue = index$3.getFormattedValue(value, parseValueFormat.value);
      const dateValue = date.getDateValue(value);
      emit("select", returnValue, dateValue, formattedValue);
    }
    function select(value, options) {
      const { emitSelect = false, updateHeader = false } = options || {};
      let newValue = [...value];
      if (index$4.isCompleteRangeValue(newValue)) {
        newValue = getSortedDayjsArrayByExchangeTimeOrNot(newValue);
      }
      setProcessValue(newValue);
      setPreviewValue(void 0);
      setInputValue(void 0);
      startHeaderMode.value = void 0;
      endHeaderMode.value = void 0;
      if (emitSelect) {
        emitSelectEvent(newValue);
      }
      if (updateHeader) {
        resetHeaderValue();
      }
    }
    function preview(value, options) {
      const { updateHeader = false } = options || {};
      setPreviewValue(value);
      setInputValue(void 0);
      if (updateHeader) {
        resetHeaderValue();
      }
    }
    function focusInput(index2) {
      refInput.value && refInput.value.focus && refInput.value.focus(index2);
    }
    function getMergedOpValue(date$1, time) {
      if (!hasTime.value)
        return date$1;
      return index$4.mergeValueWithTime(date.getNow(), date$1, time);
    }
    function onPanelVisibleChange(visible) {
      setPanelVisible(visible);
    }
    function onPanelCellMouseEnter(date2) {
      if (processValue.value && panelValue.value[nextFocusedIndex.value] && (!needConfirm.value || !index$4.isCompleteRangeValue(processValue.value))) {
        const newValue = [...panelValue.value];
        const mergedOpValue = getMergedOpValue(
          date2,
          timePickerValue.value[focusedIndex.value]
        );
        newValue[focusedIndex.value] = mergedOpValue;
        preview(newValue);
      }
    }
    function getValueToModify(isTime = false) {
      if (isNextDisabled.value)
        return [...selectedValue.value];
      if (processValue.value) {
        return isTime || !index$4.isCompleteRangeValue(processValue.value) ? [...processValue.value] : [];
      }
      return isTime ? [...selectedValue.value] : [];
    }
    function onPanelCellClick(date2) {
      const newValue = getValueToModify();
      const mergedOpValue = getMergedOpValue(
        date2,
        timePickerValue.value[focusedIndex.value]
      );
      newValue[focusedIndex.value] = mergedOpValue;
      emitSelectEvent(newValue);
      if (!needConfirm.value && index$4.isCompleteRangeValue(newValue)) {
        confirm(newValue, false);
      } else {
        select(newValue);
        if (!index$4.isCompleteRangeValue(newValue)) {
          focusedIndex.value = nextFocusedIndex.value;
        } else {
          focusedIndex.value = 0;
        }
      }
    }
    function onTimePickerSelect(time, type) {
      const updateIndex = type === "start" ? 0 : 1;
      const mergedOpValue = getMergedOpValue(
        timePickerValue.value[updateIndex],
        time
      );
      const newTimeValue = [...timePickerValue.value];
      newTimeValue[updateIndex] = mergedOpValue;
      setTimePickerValue(newTimeValue);
      const newValue = getValueToModify(true);
      if (newValue[updateIndex]) {
        newValue[updateIndex] = mergedOpValue;
        select(newValue, { emitSelect: true });
      }
    }
    let clearShortcutPreviewTimer;
    vue.onUnmounted(() => {
      clearTimeout(clearShortcutPreviewTimer);
    });
    function onPanelShortcutMouseEnter(value) {
      clearTimeout(clearShortcutPreviewTimer);
      preview(value, { updateHeader: true });
    }
    function onPanelShortcutMouseLeave() {
      clearTimeout(clearShortcutPreviewTimer);
      clearShortcutPreviewTimer = setTimeout(() => {
        setPreviewValue(void 0);
        setInputValue(void 0);
        resetHeaderValue();
      }, 100);
    }
    function onPanelShortcutClick(value, shortcut) {
      emit("select-shortcut", shortcut);
      confirm(value, false);
    }
    function onPanelConfirm() {
      confirm(panelValue.value, false, true);
    }
    function onInputClear(e) {
      e.stopPropagation();
      confirm(void 0);
      emit("clear");
    }
    function onInputChange(e) {
      setPanelVisible(true);
      const targetValue = e.target.value;
      if (!targetValue) {
        setInputValue(void 0);
        return;
      }
      const formattedPanelValue = index$3.getFormattedValue(
        panelValue.value,
        computedFormat.value
      );
      const newInputValue = is.isArray(inputValue.value) ? [...inputValue.value] : formattedPanelValue || [];
      newInputValue[focusedIndex.value] = targetValue;
      setInputValue(newInputValue);
      if (!index$3.isValidInputValue(targetValue, computedFormat.value))
        return;
      const targetValueDayjs = date.dayjs(targetValue, computedFormat.value);
      if (isDisabledDate(
        targetValueDayjs,
        focusedIndex.value === 0 ? "start" : "end"
      ))
        return;
      const newValue = is.isArray(panelValue.value) ? [...panelValue.value] : [];
      newValue[focusedIndex.value] = targetValueDayjs;
      select(newValue, { updateHeader: true });
    }
    function onInputPressEnter() {
      if (index$4.isValidRangeValue(panelValue.value)) {
        confirm(panelValue.value, false);
      } else {
        focusedIndex.value = nextFocusedIndex.value;
      }
    }
    const computedTimePickerProps = vue.computed(() => ({
      format: computedFormat.value,
      ...omit.omit((timePickerProps == null ? void 0 : timePickerProps.value) || {}, ["defaultValue"]),
      visible: panelVisible.value
    }));
    const headerIcons = vue.computed(() => ({
      prev: slots["icon-prev"],
      prevDouble: slots["icon-prev-double"],
      next: slots["icon-next"],
      nextDouble: slots["icon-next-double"]
    }));
    const startHeaderProps = vue.reactive({
      headerValue: startHeaderValue,
      headerOperations: startHeaderOperations,
      headerIcons
    });
    const endHeaderProps = vue.reactive({
      headerValue: endHeaderValue,
      headerOperations: endHeaderOperations,
      headerIcons
    });
    const rangePanelProps = vue.computed(() => ({
      ...pick(props, [
        "mode",
        "showTime",
        "shortcuts",
        "shortcutsPosition",
        "dayStartOfWeek",
        "disabledDate",
        "disabledTime",
        "hideTrigger",
        "abbreviation"
      ]),
      prefixCls,
      format: parseValueFormat.value,
      value: panelValue.value,
      showConfirmBtn: needConfirm.value,
      confirmBtnDisabled: confirmBtnDisabled.value,
      timePickerValue: timePickerValue.value,
      timePickerProps: computedTimePickerProps.value,
      extra: slots.extra,
      dateRender: slots.cell,
      startHeaderProps,
      endHeaderProps,
      footerValue: footerValue.value,
      disabled: disabledArray.value,
      visible: panelVisible.value,
      onCellClick: onPanelCellClick,
      onCellMouseEnter: onPanelCellMouseEnter,
      onShortcutClick: onPanelShortcutClick,
      onShortcutMouseEnter: previewShortcut.value ? onPanelShortcutMouseEnter : void 0,
      onShortcutMouseLeave: previewShortcut.value ? onPanelShortcutMouseLeave : void 0,
      onConfirm: onPanelConfirm,
      onTimePickerSelect,
      startHeaderMode: startHeaderMode.value,
      endHeaderMode: endHeaderMode.value,
      onStartHeaderLabelClick: onStartPanelHeaderLabelClick,
      onEndHeaderLabelClick: onEndPanelHeaderLabelClick,
      onStartHeaderSelect: onStartPanelHeaderSelect,
      onEndHeaderSelect: onEndPanelHeaderSelect
    }));
    return {
      prefixCls,
      refInput,
      computedFormat,
      computedPlaceholder,
      panelVisible,
      panelValue,
      inputValue,
      focusedIndex,
      triggerDisabled,
      mergedSize,
      mergedError,
      onPanelVisibleChange,
      onInputClear,
      onInputChange,
      onInputPressEnter,
      rangePanelProps
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconCalendar = vue.resolveComponent("IconCalendar");
  const _component_DateRangeInput = vue.resolveComponent("DateRangeInput");
  const _component_RangePickerPanel = vue.resolveComponent("RangePickerPanel");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return !_ctx.hideTrigger ? (vue.openBlock(), vue.createBlock(_component_Trigger, vue.mergeProps({
    key: 0,
    trigger: "click",
    "animation-name": "slide-dynamic-origin",
    "auto-fit-transform-origin": "",
    "click-to-close": false,
    "popup-offset": 4
  }, _ctx.triggerProps, {
    "unmount-on-close": _ctx.unmountOnClose,
    position: _ctx.position,
    disabled: _ctx.triggerDisabled || _ctx.readonly,
    "popup-visible": _ctx.panelVisible,
    "popup-container": _ctx.popupContainer,
    onPopupVisibleChange: _ctx.onPanelVisibleChange
  }), {
    content: vue.withCtx(() => [
      vue.createVNode(_component_RangePickerPanel, vue.normalizeProps(vue.guardReactiveProps(_ctx.rangePanelProps)), null, 16)
    ]),
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createVNode(_component_DateRangeInput, vue.mergeProps({ ref: "refInput" }, _ctx.$attrs, {
          focusedIndex: _ctx.focusedIndex,
          "onUpdate:focusedIndex": _cache[0] || (_cache[0] = ($event) => _ctx.focusedIndex = $event),
          size: _ctx.size,
          focused: _ctx.panelVisible,
          visible: _ctx.panelVisible,
          error: _ctx.error,
          disabled: _ctx.disabled,
          readonly: _ctx.readonly || _ctx.disabledInput,
          "allow-clear": _ctx.allowClear && !_ctx.readonly,
          placeholder: _ctx.computedPlaceholder,
          "input-value": _ctx.inputValue,
          value: _ctx.panelValue,
          format: _ctx.computedFormat,
          onClear: _ctx.onInputClear,
          onChange: _ctx.onInputChange,
          onPressEnter: _ctx.onInputPressEnter
        }), vue.createSlots({
          "suffix-icon": vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "suffix-icon", {}, () => [
              vue.createVNode(_component_IconCalendar)
            ])
          ]),
          separator: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "separator", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.separator || "-"), 1)
            ])
          ]),
          _: 2
        }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "prefix")
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["focusedIndex", "size", "focused", "visible", "error", "disabled", "readonly", "allow-clear", "placeholder", "input-value", "value", "format", "onClear", "onChange", "onPressEnter"])
      ])
    ]),
    _: 3
  }, 16, ["unmount-on-close", "position", "disabled", "popup-visible", "popup-container", "onPopupVisibleChange"])) : (vue.openBlock(), vue.createBlock(_component_RangePickerPanel, vue.normalizeProps(vue.mergeProps({ key: 1 }, { ..._ctx.$attrs, ..._ctx.rangePanelProps })), null, 16));
}
var RangePicker = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = RangePicker;
