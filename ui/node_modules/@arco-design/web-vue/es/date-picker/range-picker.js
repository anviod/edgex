import { defineComponent, toRefs, inject, watchEffect, computed, reactive, ref, watch, nextTick, onUnmounted, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, normalizeProps, guardReactiveProps, renderSlot, createSlots, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isArray, isBoolean } from "../_utils/is.js";
import pick from "../_utils/pick.js";
import { getFormattedValue, isValidInputValue } from "../time-picker/utils/index.js";
import { initializeDateLocale, getDateValue, getNow, dayjs, isValueChange, getSortedDayjsArray } from "../_utils/date.js";
import useState from "../_hooks/use-state.js";
import { isCompleteRangeValue, isValidRangeValue, mergeValueWithTime } from "./utils/index.js";
import useFormat from "./hooks/use-format.js";
import useRangePickerState from "./hooks/use-range-picker-state.js";
import useRangeHeaderValue from "./hooks/use-range-header-value.js";
import Trigger from "../trigger/index.js";
import DateRangeInput from "../_components/picker/input-range.js";
import RangePickerPanel from "./range-picker-panel.js";
import useRangeTimePickerValue from "./hooks/use-range-time-picker-value.js";
import useIsDisabledDate from "./hooks/use-is-disabled-date.js";
import { omit } from "../_utils/omit.js";
import useMergeState from "../_hooks/use-merge-state.js";
import IconCalendar from "../icon/icon-calendar/index.js";
import useDatePickerTransform from "./hooks/use-provide-datepicker-transform.js";
import { getReturnRangeValue } from "./hooks/use-value-format.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useI18n } from "../locale/index.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "RangePicker",
  components: {
    RangePickerPanel,
    DateRangeInput,
    Trigger,
    IconCalendar
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
    "change": (value, date, dateString) => {
      return true;
    },
    "update:modelValue": (value) => {
      return true;
    },
    "select": (value, date, dateString) => {
      return true;
    },
    "popup-visible-change": (visible) => {
      return true;
    },
    "update:popupVisible": (visible) => {
      return true;
    },
    "ok": (value, date, dateString) => {
      return true;
    },
    "clear": () => {
      return true;
    },
    "select-shortcut": (shortcut) => {
      return true;
    },
    "picker-value-change": (value, date, dateString) => {
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
    } = toRefs(props);
    const { locale: globalLocal } = useI18n();
    const configCtx = inject(configProviderInjectionKey, void 0);
    watchEffect(() => {
      initializeDateLocale(globalLocal.value, dayStartOfWeek.value);
    });
    const mergedExchangeTime = computed(() => {
      var _a;
      return !(!exchangeTime.value || !((_a = configCtx == null ? void 0 : configCtx.exchangeTime) != null ? _a : true));
    });
    const {
      mergedSize,
      mergedDisabled: formDisabled,
      mergedError,
      eventHandlers
    } = useFormItem({
      size,
      error
    });
    const datePickerT = useDatePickerTransform(
      reactive({
        locale
      })
    );
    const prefixCls = getPrefixCls("picker");
    const computedPlaceholder = computed(
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
    } = useFormat(
      reactive({
        mode,
        format,
        showTime,
        valueFormat
      })
    );
    const disabledArray = computed(() => {
      const disabled0 = disabled.value === true || formDisabled.value || isArray(disabled.value) && disabled.value[0] === true;
      const disabled1 = disabled.value === true || formDisabled.value || isArray(disabled.value) && disabled.value[1] === true;
      return [disabled0, disabled1];
    });
    const triggerDisabled = computed(
      () => disabledArray.value[0] && disabledArray.value[1]
    );
    function getFocusedIndex(cur = 0) {
      return disabledArray.value[cur] ? cur ^ 1 : cur;
    }
    const refInput = ref();
    const focusedIndex = ref(getFocusedIndex());
    const nextFocusedIndex = computed(() => {
      const cur = focusedIndex.value;
      const next = cur ^ 1;
      return disabledArray.value[next] ? cur : next;
    });
    const isNextDisabled = computed(
      () => disabledArray.value[focusedIndex.value ^ 1]
    );
    const { value: selectedValue, setValue: setSelectedValue } = useRangePickerState(
      reactive({
        modelValue,
        defaultValue,
        format: parseValueFormat
      })
    );
    const [processValue, setProcessValue] = useState();
    const [previewValue, setPreviewValue] = useState();
    const forSelectedValue = computed(
      () => {
        var _a;
        return (_a = processValue.value) != null ? _a : selectedValue.value;
      }
    );
    const panelValue = computed(
      () => {
        var _a, _b;
        return (_b = (_a = previewValue.value) != null ? _a : processValue.value) != null ? _b : selectedValue.value;
      }
    );
    const [inputValue, setInputValue] = useState();
    const startHeaderMode = ref();
    const endHeaderMode = ref();
    const [panelVisible, setLocalPanelVisible] = useMergeState(
      defaultPopupVisible.value,
      reactive({ value: popupVisible })
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
      reactive({
        mode,
        startHeaderMode,
        endHeaderMode,
        value: pickerValue,
        defaultValue: defaultPickerValue,
        selectedValue: panelValue,
        format: parseValueFormat,
        onChange: (newVal) => {
          const returnValue = getReturnRangeValue(
            newVal,
            returnValueFormat.value
          );
          const formattedValue = getFormattedValue(
            newVal,
            parseValueFormat.value
          );
          const dateValue = getDateValue(newVal);
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
    function onStartPanelHeaderSelect(date) {
      let newStartValue = startHeaderValue.value;
      newStartValue = newStartValue.set("year", date.year());
      if (startHeaderMode.value === "month") {
        newStartValue = newStartValue.set("month", date.month());
      }
      setHeaderValue([newStartValue, endHeaderValue.value]);
      startHeaderMode.value = void 0;
    }
    function onEndPanelHeaderSelect(date) {
      let newEndValue = endHeaderValue.value;
      newEndValue = newEndValue.set("year", date.year());
      if (endHeaderMode.value === "month") {
        newEndValue = newEndValue.set("month", date.month());
      }
      setHeaderValue([startHeaderValue.value, newEndValue]);
      endHeaderMode.value = void 0;
    }
    const footerValue = ref([
      panelValue.value[0] || getNow(),
      panelValue.value[1] || getNow()
    ]);
    watch(panelValue, () => {
      const [value0, value1] = panelValue.value;
      footerValue.value[0] = value0 || footerValue.value[0];
      footerValue.value[1] = value1 || footerValue.value[1];
    });
    const [timePickerValue, setTimePickerValue, resetTimePickerValue] = useRangeTimePickerValue(
      reactive({
        timePickerProps,
        selectedValue: panelValue
      })
    );
    const isDateTime = computed(() => mode.value === "date" && showTime.value);
    const hasTime = computed(() => isDateTime.value || timePickerProps.value);
    const isDisabledDate = useIsDisabledDate(
      reactive({
        mode,
        isRange: true,
        showTime,
        disabledDate,
        disabledTime
      })
    );
    const needConfirm = computed(
      () => isDateTime.value || showConfirmBtn.value
    );
    const confirmBtnDisabled = computed(
      () => needConfirm.value && (!isCompleteRangeValue(forSelectedValue.value) || isDisabledDate(forSelectedValue.value[0], "start") || isDisabledDate(forSelectedValue.value[1], "end"))
    );
    watch(panelVisible, (newVisible) => {
      startHeaderMode.value = void 0;
      endHeaderMode.value = void 0;
      setProcessValue(void 0);
      setPreviewValue(void 0);
      if (newVisible) {
        resetHeaderValue();
        resetTimePickerValue();
        focusedIndex.value = getFocusedIndex(focusedIndex.value);
        nextTick(() => focusInput(focusedIndex.value));
      }
      if (!newVisible) {
        setInputValue(void 0);
      }
    });
    watch(focusedIndex, () => {
      if (props.disabledInput) {
        focusInput(focusedIndex.value);
        setInputValue(void 0);
      }
    });
    function emitChange(value, emitOk) {
      var _a, _b;
      const returnValue = value ? getReturnRangeValue(value, returnValueFormat.value) : void 0;
      const formattedValue = getFormattedValue(value, parseValueFormat.value);
      const dateValue = getDateValue(value);
      if (isValueChange(value, selectedValue.value)) {
        emit("update:modelValue", returnValue);
        emit("change", returnValue, dateValue, formattedValue);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      }
      if (emitOk) {
        emit("ok", returnValue, dateValue, formattedValue);
      }
    }
    function getSortedDayjsArrayByExchangeTimeOrNot(newValue) {
      let sortedValue = getSortedDayjsArray(newValue);
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
      if (isCompleteRangeValue(newValue)) {
        newValue = getSortedDayjsArrayByExchangeTimeOrNot(newValue);
      }
      emitChange(newValue, emitOk);
      setSelectedValue(newValue || []);
      setProcessValue(void 0);
      setPreviewValue(void 0);
      setInputValue(void 0);
      startHeaderMode.value = void 0;
      endHeaderMode.value = void 0;
      if (isBoolean(showPanel)) {
        setPanelVisible(showPanel);
      }
    }
    function emitSelectEvent(value) {
      const returnValue = getReturnRangeValue(value, returnValueFormat.value);
      const formattedValue = getFormattedValue(value, parseValueFormat.value);
      const dateValue = getDateValue(value);
      emit("select", returnValue, dateValue, formattedValue);
    }
    function select(value, options) {
      const { emitSelect = false, updateHeader = false } = options || {};
      let newValue = [...value];
      if (isCompleteRangeValue(newValue)) {
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
    function focusInput(index) {
      refInput.value && refInput.value.focus && refInput.value.focus(index);
    }
    function getMergedOpValue(date, time) {
      if (!hasTime.value)
        return date;
      return mergeValueWithTime(getNow(), date, time);
    }
    function onPanelVisibleChange(visible) {
      setPanelVisible(visible);
    }
    function onPanelCellMouseEnter(date) {
      if (processValue.value && panelValue.value[nextFocusedIndex.value] && (!needConfirm.value || !isCompleteRangeValue(processValue.value))) {
        const newValue = [...panelValue.value];
        const mergedOpValue = getMergedOpValue(
          date,
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
        return isTime || !isCompleteRangeValue(processValue.value) ? [...processValue.value] : [];
      }
      return isTime ? [...selectedValue.value] : [];
    }
    function onPanelCellClick(date) {
      const newValue = getValueToModify();
      const mergedOpValue = getMergedOpValue(
        date,
        timePickerValue.value[focusedIndex.value]
      );
      newValue[focusedIndex.value] = mergedOpValue;
      emitSelectEvent(newValue);
      if (!needConfirm.value && isCompleteRangeValue(newValue)) {
        confirm(newValue, false);
      } else {
        select(newValue);
        if (!isCompleteRangeValue(newValue)) {
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
    onUnmounted(() => {
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
      const formattedPanelValue = getFormattedValue(
        panelValue.value,
        computedFormat.value
      );
      const newInputValue = isArray(inputValue.value) ? [...inputValue.value] : formattedPanelValue || [];
      newInputValue[focusedIndex.value] = targetValue;
      setInputValue(newInputValue);
      if (!isValidInputValue(targetValue, computedFormat.value))
        return;
      const targetValueDayjs = dayjs(targetValue, computedFormat.value);
      if (isDisabledDate(
        targetValueDayjs,
        focusedIndex.value === 0 ? "start" : "end"
      ))
        return;
      const newValue = isArray(panelValue.value) ? [...panelValue.value] : [];
      newValue[focusedIndex.value] = targetValueDayjs;
      select(newValue, { updateHeader: true });
    }
    function onInputPressEnter() {
      if (isValidRangeValue(panelValue.value)) {
        confirm(panelValue.value, false);
      } else {
        focusedIndex.value = nextFocusedIndex.value;
      }
    }
    const computedTimePickerProps = computed(() => ({
      format: computedFormat.value,
      ...omit((timePickerProps == null ? void 0 : timePickerProps.value) || {}, ["defaultValue"]),
      visible: panelVisible.value
    }));
    const headerIcons = computed(() => ({
      prev: slots["icon-prev"],
      prevDouble: slots["icon-prev-double"],
      next: slots["icon-next"],
      nextDouble: slots["icon-next-double"]
    }));
    const startHeaderProps = reactive({
      headerValue: startHeaderValue,
      headerOperations: startHeaderOperations,
      headerIcons
    });
    const endHeaderProps = reactive({
      headerValue: endHeaderValue,
      headerOperations: endHeaderOperations,
      headerIcons
    });
    const rangePanelProps = computed(() => ({
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
  const _component_IconCalendar = resolveComponent("IconCalendar");
  const _component_DateRangeInput = resolveComponent("DateRangeInput");
  const _component_RangePickerPanel = resolveComponent("RangePickerPanel");
  const _component_Trigger = resolveComponent("Trigger");
  return !_ctx.hideTrigger ? (openBlock(), createBlock(_component_Trigger, mergeProps({
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
    content: withCtx(() => [
      createVNode(_component_RangePickerPanel, normalizeProps(guardReactiveProps(_ctx.rangePanelProps)), null, 16)
    ]),
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createVNode(_component_DateRangeInput, mergeProps({ ref: "refInput" }, _ctx.$attrs, {
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
        }), createSlots({
          "suffix-icon": withCtx(() => [
            renderSlot(_ctx.$slots, "suffix-icon", {}, () => [
              createVNode(_component_IconCalendar)
            ])
          ]),
          separator: withCtx(() => [
            renderSlot(_ctx.$slots, "separator", {}, () => [
              createTextVNode(toDisplayString(_ctx.separator || "-"), 1)
            ])
          ]),
          _: 2
        }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "prefix")
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["focusedIndex", "size", "focused", "visible", "error", "disabled", "readonly", "allow-clear", "placeholder", "input-value", "value", "format", "onClear", "onChange", "onPressEnter"])
      ])
    ]),
    _: 3
  }, 16, ["unmount-on-close", "position", "disabled", "popup-visible", "popup-container", "onPopupVisibleChange"])) : (openBlock(), createBlock(_component_RangePickerPanel, normalizeProps(mergeProps({ key: 1 }, { ..._ctx.$attrs, ..._ctx.rangePanelProps })), null, 16));
}
var RangePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { RangePicker as default };
