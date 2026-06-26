"use strict";
var vue = require("vue");
var date = require("../_utils/date.js");
var globalConfig = require("../_utils/global-config.js");
var useState = require("../_hooks/use-state.js");
var usePickerState = require("./hooks/use-picker-state.js");
var input = require("../_components/picker/input.js");
var index = require("../trigger/index.js");
var index$3 = require("../time-picker/utils/index.js");
var pickerPanel = require("./picker-panel.js");
var pick = require("../_utils/pick.js");
var useFormat = require("./hooks/use-format.js");
var is = require("../_utils/is.js");
var index$1 = require("../icon/icon-calendar/index.js");
var useIsDisabledDate = require("./hooks/use-is-disabled-date.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var useProvideDatepickerTransform = require("./hooks/use-provide-datepicker-transform.js");
var useHeaderValue = require("./hooks/use-header-value.js");
var omit = require("../_utils/omit.js");
var useTimePickerValue = require("./hooks/use-time-picker-value.js");
var index$4 = require("./utils/index.js");
var useValueFormat = require("./hooks/use-value-format.js");
var useFormItem = require("../_hooks/use-form-item.js");
var index$2 = require("../locale/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Picker",
  components: {
    DateInput: input,
    Trigger: index,
    PickerPanel: pickerPanel,
    IconCalendar: index$1
  },
  inheritAttrs: false,
  props: {
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
      type: Boolean,
      default: false
    },
    triggerProps: {
      type: Object
    },
    unmountOnClose: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    disabledDate: {
      type: Function
    },
    disabledTime: {
      type: Function
    },
    pickerValue: {
      type: [Object, String, Number]
    },
    defaultPickerValue: {
      type: [Object, String, Number]
    },
    popupContainer: {
      type: [String, Object]
    },
    mode: {
      type: String,
      default: "date"
    },
    format: {
      type: [String, Function]
    },
    valueFormat: {
      type: String
    },
    previewShortcut: {
      type: Boolean,
      default: true
    },
    showConfirmBtn: {
      type: Boolean
    },
    showTime: {
      type: Boolean
    },
    timePickerProps: {
      type: Object
    },
    showNowBtn: {
      type: Boolean,
      default: true
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    },
    modelValue: {
      type: [Object, String, Number]
    },
    defaultValue: {
      type: [Object, String, Number]
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
    "change": (value, date2, dateString) => true,
    "update:modelValue": (value) => true,
    "select": (value, date2, dateString) => true,
    "popup-visible-change": (visible) => true,
    "update:popupVisible": (visible) => true,
    "ok": (value, date2, dateString) => true,
    "clear": () => true,
    "select-shortcut": (shortcut) => true,
    "picker-value-change": (value, date2, dateString) => true,
    "update:pickerValue": (value) => true
  },
  setup(props, { emit, slots }) {
    const {
      mode,
      modelValue,
      defaultValue,
      format,
      valueFormat,
      placeholder,
      popupVisible,
      defaultPopupVisible,
      disabled,
      showTime,
      timePickerProps,
      disabledDate,
      disabledTime,
      readonly,
      locale,
      pickerValue,
      defaultPickerValue,
      dayStartOfWeek,
      previewShortcut,
      showConfirmBtn
    } = vue.toRefs(props);
    const { locale: globalLocal } = index$2.useI18n();
    vue.watchEffect(() => {
      date.initializeDateLocale(globalLocal.value, dayStartOfWeek.value);
    });
    const { mergedDisabled, eventHandlers } = useFormItem.useFormItem({ disabled });
    const datePickerT = useProvideDatepickerTransform(
      vue.reactive({
        locale
      })
    );
    const prefixCls = globalConfig.getPrefixCls("picker");
    const refInput = vue.ref();
    const computedPlaceholder = vue.computed(
      () => (placeholder == null ? void 0 : placeholder.value) || {
        date: datePickerT("datePicker.placeholder.date"),
        month: datePickerT("datePicker.placeholder.month"),
        year: datePickerT("datePicker.placeholder.year"),
        week: datePickerT("datePicker.placeholder.week"),
        quarter: datePickerT("datePicker.placeholder.quarter")
      }[mode.value] || datePickerT("datePicker.placeholder.date")
    );
    const {
      format: computedFormat,
      valueFormat: returnValueFormat,
      parseValueFormat
    } = useFormat["default"](vue.reactive({ format, mode, showTime, valueFormat }));
    const inputFormat = vue.computed(
      () => format && is.isFunction(format.value) ? (value) => {
        var _a;
        return (_a = format.value) == null ? void 0 : _a.call(format, date.getDateValue(value));
      } : computedFormat.value
    );
    const getReturnValue = useValueFormat.useReturnValue(
      vue.reactive({
        format: returnValueFormat
      })
    );
    const isDisabledDate = useIsDisabledDate(
      vue.reactive({
        mode,
        disabledDate,
        disabledTime,
        showTime
      })
    );
    const needConfirm = vue.computed(() => showTime.value || showConfirmBtn.value);
    const confirmBtnDisabled = vue.computed(
      () => needConfirm.value && (!forSelectedValue.value || isDisabledDate(forSelectedValue.value))
    );
    const isDateTime = vue.computed(() => mode.value === "date" && showTime.value);
    const { value: selectedValue, setValue: setSelectedValue } = usePickerState(
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
    const { headerValue, setHeaderValue, headerOperations, resetHeaderValue } = useHeaderValue(
      vue.reactive({
        mode,
        value: pickerValue,
        defaultValue: defaultPickerValue,
        selectedValue: panelValue,
        format: parseValueFormat,
        onChange: (newVal) => {
          const returnValue = getReturnValue(newVal);
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
    const [timePickerValue, , resetTimePickerValue] = useTimePickerValue(
      vue.reactive({
        timePickerProps,
        selectedValue: panelValue
      })
    );
    const inputEditable = vue.computed(
      () => !readonly.value && !is.isFunction(inputFormat.value)
    );
    const headerMode = vue.ref();
    vue.watch(panelVisible, (newVisible) => {
      setProcessValue(void 0);
      setPreviewValue(void 0);
      headerMode.value = void 0;
      if (newVisible) {
        resetHeaderValue();
        resetTimePickerValue();
      }
      if (!newVisible) {
        setInputValue(void 0);
      }
    });
    function emitChange(value, emitOk) {
      var _a, _b;
      const returnValue = value ? getReturnValue(value) : void 0;
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
    function confirm(value, showPanel, emitOk) {
      if (isDisabledDate(value)) {
        return;
      }
      emitChange(value, emitOk);
      setSelectedValue(value);
      setProcessValue(void 0);
      setPreviewValue(void 0);
      setInputValue(void 0);
      headerMode.value = void 0;
      if (is.isBoolean(showPanel)) {
        setPanelVisible(showPanel);
      }
    }
    function select(value, emitSelect) {
      setProcessValue(value);
      setPreviewValue(void 0);
      setInputValue(void 0);
      headerMode.value = void 0;
      if (emitSelect) {
        const returnValue = value ? getReturnValue(value) : void 0;
        const formattedValue = index$3.getFormattedValue(value, parseValueFormat.value);
        const dateValue = date.getDateValue(value);
        emit("select", returnValue, dateValue, formattedValue);
      }
    }
    function focusInput(index2) {
      refInput.value && refInput.value.focus && refInput.value.focus(index2);
    }
    function getMergedOpValue(date$1, time) {
      if (!isDateTime.value && !timePickerProps.value)
        return date$1;
      return index$4.mergeValueWithTime(date.getNow(), date$1, time);
    }
    function onPanelVisibleChange(visible) {
      if (mergedDisabled.value)
        return;
      setPanelVisible(visible);
    }
    function onInputClear(e) {
      e.stopPropagation();
      confirm(void 0);
      emit("clear");
    }
    function onInputBlur() {
      var _a, _b;
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a);
    }
    function onInputChange(e) {
      setPanelVisible(true);
      const targetValue = e.target.value;
      setInputValue(targetValue);
      if (!index$3.isValidInputValue(targetValue, computedFormat.value))
        return;
      const newValue = date.dayjs(targetValue, computedFormat.value);
      if (isDisabledDate(newValue))
        return;
      if (needConfirm.value) {
        select(newValue);
      } else {
        confirm(newValue, true);
      }
    }
    function onInputPressEnter() {
      confirm(panelValue.value, false);
    }
    function onPanelSelect(value) {
      if (needConfirm.value) {
        select(value, true);
      } else {
        confirm(value, false);
      }
    }
    function onPanelCellClick(value) {
      const newValue = getMergedOpValue(value, timePickerValue.value);
      onPanelSelect(newValue);
    }
    function onTimePickerSelect(time) {
      const newValue = getMergedOpValue(panelValue.value || date.getNow(), time);
      onPanelSelect(newValue);
    }
    function onPanelConfirm() {
      confirm(panelValue.value, false, true);
    }
    function onPanelClick() {
      if (props.disabledInput) {
        focusInput();
      }
    }
    let clearPreviewTimer;
    vue.onUnmounted(() => {
      clearTimeout(clearPreviewTimer);
    });
    function onPanelShortcutMouseEnter(value) {
      clearTimeout(clearPreviewTimer);
      setPreviewValue(value);
      setInputValue(void 0);
    }
    function onPanelShortcutMouseLeave() {
      clearTimeout(clearPreviewTimer);
      clearPreviewTimer = setTimeout(() => {
        setPreviewValue(void 0);
      }, 100);
    }
    function onPanelShortcutClick(value, shortcut) {
      emit("select-shortcut", shortcut);
      confirm(value, false);
    }
    function onPanelHeaderLabelClick(type) {
      headerMode.value = type;
    }
    function onMonthHeaderClick() {
      headerMode.value = "year";
    }
    function onPanelHeaderSelect(date2) {
      let newValue = headerValue.value;
      newValue = newValue.set("year", date2.year());
      if (headerMode.value === "month") {
        newValue = newValue.set("month", date2.month());
      }
      setHeaderValue(newValue);
      if (mode.value === "quarter" || mode.value === "month") {
        headerMode.value = void 0;
        return;
      }
      headerMode.value = headerMode.value === "year" ? "month" : void 0;
    }
    const computedTimePickerProps = vue.computed(() => ({
      format: computedFormat.value,
      ...omit.omit((timePickerProps == null ? void 0 : timePickerProps.value) || {}, ["defaultValue"]),
      visible: panelVisible.value
    }));
    const panelProps = vue.computed(() => ({
      ...pick(props, [
        "mode",
        "shortcuts",
        "shortcutsPosition",
        "dayStartOfWeek",
        "disabledDate",
        "disabledTime",
        "showTime",
        "hideTrigger",
        "abbreviation"
      ]),
      showNowBtn: props.showNowBtn && mode.value === "date",
      prefixCls,
      format: parseValueFormat.value,
      value: panelValue.value,
      visible: panelVisible.value,
      showConfirmBtn: needConfirm.value,
      confirmBtnDisabled: confirmBtnDisabled.value,
      timePickerProps: computedTimePickerProps.value,
      extra: slots.extra,
      dateRender: slots.cell,
      headerValue: headerValue.value,
      headerIcons: {
        prev: slots["icon-prev"],
        prevDouble: slots["icon-prev-double"],
        next: slots["icon-next"],
        nextDouble: slots["icon-next-double"]
      },
      headerOperations: headerOperations.value,
      timePickerValue: timePickerValue.value,
      headerMode: headerMode.value,
      onCellClick: onPanelCellClick,
      onTimePickerSelect,
      onConfirm: onPanelConfirm,
      onShortcutClick: onPanelShortcutClick,
      onShortcutMouseEnter: previewShortcut.value ? onPanelShortcutMouseEnter : void 0,
      onShortcutMouseLeave: previewShortcut.value ? onPanelShortcutMouseLeave : void 0,
      onTodayBtnClick: onPanelSelect,
      onHeaderLabelClick: onPanelHeaderLabelClick,
      onHeaderSelect: onPanelHeaderSelect,
      onMonthHeaderClick
    }));
    return {
      prefixCls,
      refInput,
      panelProps,
      panelValue,
      inputValue,
      selectedValue,
      inputFormat,
      computedPlaceholder,
      panelVisible,
      inputEditable,
      needConfirm,
      mergedDisabled,
      onPanelVisibleChange,
      onInputClear,
      onInputChange,
      onInputPressEnter,
      onInputBlur,
      onPanelClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconCalendar = vue.resolveComponent("IconCalendar");
  const _component_DateInput = vue.resolveComponent("DateInput");
  const _component_PickerPanel = vue.resolveComponent("PickerPanel");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return !_ctx.hideTrigger ? (vue.openBlock(), vue.createBlock(_component_Trigger, vue.mergeProps({
    key: 0,
    trigger: "click",
    "animation-name": "slide-dynamic-origin",
    "auto-fit-transform-origin": "",
    "click-to-close": false,
    "popup-offset": 4
  }, _ctx.triggerProps, {
    position: _ctx.position,
    disabled: _ctx.mergedDisabled || _ctx.readonly,
    "prevent-focus": true,
    "popup-visible": _ctx.panelVisible,
    "unmount-on-close": _ctx.unmountOnClose,
    "popup-container": _ctx.popupContainer,
    onPopupVisibleChange: _ctx.onPanelVisibleChange
  }), {
    content: vue.withCtx(() => [
      vue.createVNode(_component_PickerPanel, vue.mergeProps(_ctx.panelProps, { onClick: _ctx.onPanelClick }), null, 16, ["onClick"])
    ]),
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createVNode(_component_DateInput, vue.mergeProps(_ctx.$attrs, {
          ref: "refInput",
          size: _ctx.size,
          focused: _ctx.panelVisible,
          visible: _ctx.panelVisible,
          error: _ctx.error,
          disabled: _ctx.mergedDisabled,
          readonly: !_ctx.inputEditable || _ctx.disabledInput,
          "allow-clear": _ctx.allowClear && !_ctx.readonly,
          placeholder: _ctx.computedPlaceholder,
          "input-value": _ctx.inputValue,
          value: _ctx.needConfirm ? _ctx.panelValue : _ctx.selectedValue,
          format: _ctx.inputFormat,
          onClear: _ctx.onInputClear,
          onChange: _ctx.onInputChange,
          onPressEnter: _ctx.onInputPressEnter,
          onBlur: _ctx.onInputBlur
        }), vue.createSlots({
          "suffix-icon": vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "suffix-icon", {}, () => [
              vue.createVNode(_component_IconCalendar)
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
        ]), 1040, ["size", "focused", "visible", "error", "disabled", "readonly", "allow-clear", "placeholder", "input-value", "value", "format", "onClear", "onChange", "onPressEnter", "onBlur"])
      ])
    ]),
    _: 3
  }, 16, ["position", "disabled", "popup-visible", "unmount-on-close", "popup-container", "onPopupVisibleChange"])) : (vue.openBlock(), vue.createBlock(_component_PickerPanel, vue.normalizeProps(vue.mergeProps({ key: 1 }, { ..._ctx.$attrs, ..._ctx.panelProps })), null, 16));
}
var Picker = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Picker;
