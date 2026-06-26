"use strict";
var vue = require("vue");
var date = require("../_utils/date.js");
var is = require("../_utils/is.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../trigger/index.js");
var input = require("../_components/picker/input.js");
var inputRange = require("../_components/picker/input-range.js");
var index$1 = require("../icon/icon-clock-circle/index.js");
var useState = require("../_hooks/use-state.js");
var useTimeFormat = require("./hooks/use-time-format.js");
var useTimeState = require("./hooks/use-time-state.js");
var index$3 = require("./utils/index.js");
var panel = require("./panel.js");
var rangePanel = require("./range-panel.js");
var useIsDisabledTime = require("./hooks/use-is-disabled-time.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var index$2 = require("../locale/index.js");
var useFormItem = require("../_hooks/use-form-item.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TimePicker",
  components: {
    Trigger: index,
    DateInput: input,
    DateRangeInput: inputRange,
    Panel: panel,
    RangePanel: rangePanel,
    IconClockCircle: index$1
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "time"
    },
    modelValue: {
      type: [String, Number, Date, Array]
    },
    defaultValue: {
      type: [String, Number, Date, Array]
    },
    disabled: {
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
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    placeholder: {
      type: [String, Array]
    },
    size: {
      type: String
    },
    popupContainer: {
      type: [String, Object]
    },
    use12Hours: {
      type: Boolean
    },
    step: {
      type: Object
    },
    disabledHours: {
      type: Function
    },
    disabledMinutes: {
      type: Function
    },
    disabledSeconds: {
      type: Function
    },
    hideDisabledOptions: {
      type: Boolean
    },
    disableConfirm: {
      type: Boolean
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
    }
  },
  emits: {
    "change": (timeString, time) => true,
    "update:modelValue": (timeString) => true,
    "select": (timeString, time) => true,
    "clear": () => true,
    "popup-visible-change": (visible) => true,
    "update:popupVisible": (visible) => true
  },
  setup(props, { emit }) {
    const {
      type,
      format,
      use12Hours,
      modelValue,
      defaultValue,
      popupVisible,
      defaultPopupVisible,
      disabled,
      placeholder,
      disableConfirm,
      disabledHours,
      disabledMinutes,
      disabledSeconds
    } = vue.toRefs(props);
    const { mergedDisabled, eventHandlers } = useFormItem.useFormItem({ disabled });
    const isRange = vue.computed(() => type.value === "time-range");
    const prefixCls = globalConfig.getPrefixCls("timepicker");
    const refInput = vue.ref();
    const { format: computedFormat, use12Hours: computedUse12Hours } = useTimeFormat(
      vue.reactive({
        format,
        use12Hours
      })
    );
    const {
      computedValue,
      panelValue,
      inputValue,
      setValue,
      setPanelValue,
      setInputValue
    } = useTimeState(
      vue.reactive({
        modelValue,
        defaultValue,
        isRange,
        format: computedFormat
      })
    );
    const [panelVisible, setLocalVisible] = useMergeState(
      defaultPopupVisible.value,
      vue.reactive({ value: popupVisible })
    );
    const setPanelVisible = (newVisible) => {
      if (newVisible !== panelVisible.value) {
        setLocalVisible(newVisible);
        emit("popup-visible-change", newVisible);
        emit("update:popupVisible", newVisible);
      }
    };
    const { t } = index$2.useI18n();
    const [focusedInputIndex, setFocusedInputIndex] = useState(0);
    const computedPlaceholder = vue.computed(() => {
      const _placeholder = placeholder == null ? void 0 : placeholder.value;
      if (!isRange.value) {
        return !is.isUndefined(_placeholder) ? _placeholder : t("datePicker.placeholder.time");
      }
      if (is.isUndefined(_placeholder)) {
        return t("datePicker.rangePlaceholder.time");
      }
      if (!is.isArray(_placeholder)) {
        return [_placeholder, _placeholder];
      }
      return _placeholder;
    });
    const isDisabledTime = useIsDisabledTime(
      vue.reactive({
        disabledHours,
        disabledMinutes,
        disabledSeconds
      })
    );
    function emitChange(value) {
      var _a, _b;
      if (date.isValueChange(value, computedValue.value)) {
        const formattedValue = index$3.getFormattedValue(value, computedFormat.value);
        const dateValue = date.getDateValue(value);
        emit("update:modelValue", formattedValue);
        emit("change", formattedValue, dateValue);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      }
    }
    function confirm(value, showPanel) {
      if (isDisabledTime(value))
        return;
      let newValue = value;
      if (is.isArray(value)) {
        const now = date.dayjs();
        newValue = value.map((item) => {
          if (item) {
            item = item.year(now.year());
            item = item.month(now.month());
            item = item.date(now.date());
          }
          return item;
        });
        if (index$3.isValidRangeValue(newValue)) {
          newValue = date.getSortedDayjsArray(newValue);
        }
        if ((newValue == null ? void 0 : newValue.length) === 0) {
          newValue = void 0;
        }
      }
      emitChange(newValue);
      setValue(newValue);
      if (showPanel !== panelVisible.value) {
        setPanelVisible(showPanel);
      }
    }
    function select(value, showPanel) {
      setPanelValue(value);
      if (showPanel !== panelVisible.value) {
        setPanelVisible(showPanel);
      }
    }
    function focusInput(index2) {
      refInput.value && refInput.value.focus && refInput.value.focus(index2);
    }
    function onPanelVisibleChange(newVisible) {
      if (mergedDisabled.value)
        return;
      setPanelVisible(newVisible);
      if (newVisible) {
        vue.nextTick(() => {
          focusInput(focusedInputIndex.value);
        });
      }
    }
    function onPanelSelect(value) {
      const formattedValue = index$3.getFormattedValue(value, computedFormat.value);
      const dateValue = date.getDateValue(value);
      emit("select", formattedValue, dateValue);
      if (disableConfirm.value && (!isRange.value || index$3.isValidRangeValue(value))) {
        confirm(value, true);
      } else {
        select(value, true);
        setInputValue(void 0);
      }
    }
    function onPanelConfirm(value) {
      confirm(value, false);
    }
    function onInputPressEnter() {
      confirm(panelValue.value || computedValue.value, false);
    }
    function onRangeInputPressEnter() {
      if (index$3.isValidRangeValue(panelValue.value)) {
        confirm(panelValue.value, false);
      } else {
        const newFocusedInputIndex = (focusedInputIndex.value + 1) % 2;
        setFocusedInputIndex(newFocusedInputIndex);
        focusInput(newFocusedInputIndex);
      }
    }
    function onInputChange(e) {
      setPanelVisible(true);
      const targetValue = e.target.value;
      setInputValue(targetValue);
      if (!index$3.isValidInputValue(targetValue, computedFormat.value))
        return;
      const newValue = date.dayjs(targetValue, computedFormat.value);
      if (isDisabledTime(newValue))
        return;
      if (disableConfirm.value) {
        confirm(newValue, true);
      } else {
        select(newValue, true);
      }
    }
    function onRangeInputChange(e) {
      setPanelVisible(true);
      const targetValue = e.target.value;
      const newInputValue = is.isArray(inputValue.value) ? [...inputValue.value] : is.isArray(panelValue.value) && index$3.getFormattedValue(panelValue.value, computedFormat.value) || [];
      newInputValue[focusedInputIndex.value] = targetValue;
      setInputValue(newInputValue);
      if (!index$3.isValidInputValue(targetValue, computedFormat.value))
        return;
      const targetValueDayjs = date.dayjs(targetValue, computedFormat.value);
      if (isDisabledTime(targetValueDayjs))
        return;
      const newValue = is.isArray(panelValue.value) ? [...panelValue.value] : [];
      newValue[focusedInputIndex.value] = targetValueDayjs;
      if (disableConfirm.value && index$3.isValidRangeValue(newValue)) {
        confirm(newValue, true);
      } else {
        select(newValue, true);
      }
    }
    function onClear(e) {
      e.stopPropagation();
      setPanelValue(void 0);
      confirm(void 0, isRange.value);
    }
    vue.watch(panelVisible, (curVal, preVal) => {
      if (curVal !== preVal) {
        setPanelValue(computedValue.value);
      }
      if (!curVal) {
        setInputValue(void 0);
      }
    });
    const inputProps = vue.computed(() => {
      if (isRange.value) {
        return {
          focusedIndex: focusedInputIndex.value,
          onFocusedIndexChange: (index2) => {
            setFocusedInputIndex(index2);
          },
          onChange: onRangeInputChange,
          onPressEnter: onRangeInputPressEnter
        };
      }
      return {
        onChange: onInputChange,
        onPressEnter: onInputPressEnter
      };
    });
    const panelProps = vue.computed(() => {
      if (isRange.value) {
        return {
          displayIndex: focusedInputIndex.value,
          onDisplayIndexChange: (index2) => {
            setFocusedInputIndex(index2);
            focusInput(index2);
          }
        };
      }
      return {};
    });
    return {
      refInput,
      isRange,
      prefixCls,
      panelVisible,
      focusedInputIndex,
      computedPlaceholder,
      panelValue,
      inputValue,
      computedFormat,
      computedUse12Hours,
      inputProps,
      panelProps,
      mergedDisabled,
      onPanelVisibleChange,
      onInputClear: onClear,
      onPanelSelect,
      onPanelConfirm,
      onPanelClick: () => {
        focusInput(focusedInputIndex.value);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconClockCircle = vue.resolveComponent("IconClockCircle");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return vue.openBlock(), vue.createBlock(_component_Trigger, vue.mergeProps({
    trigger: "click",
    "animation-name": "slide-dynamic-origin",
    "auto-fit-transform-origin": "",
    "click-to-close": false,
    position: _ctx.position,
    disabled: _ctx.mergedDisabled || _ctx.readonly,
    "popup-offset": 4,
    "popup-visible": _ctx.panelVisible,
    "prevent-focus": true,
    "unmount-on-close": _ctx.unmountOnClose,
    "popup-container": _ctx.popupContainer
  }, { ..._ctx.triggerProps }, { onPopupVisibleChange: _ctx.onPanelVisibleChange }), {
    content: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-container`),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onPanelClick && _ctx.onPanelClick(...args))
      }, [
        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.isRange ? "RangePanel" : "Panel"), vue.mergeProps(_ctx.panelProps, {
          value: _ctx.panelValue,
          visible: _ctx.panelVisible,
          format: _ctx.computedFormat,
          "use12-hours": _ctx.computedUse12Hours,
          step: _ctx.step,
          "disabled-hours": _ctx.disabledHours,
          "disabled-minutes": _ctx.disabledMinutes,
          "disabled-seconds": _ctx.disabledSeconds,
          "hide-disabled-options": _ctx.hideDisabledOptions,
          "hide-footer": _ctx.disableConfirm,
          onSelect: _ctx.onPanelSelect,
          onConfirm: _ctx.onPanelConfirm
        }), vue.createSlots({ _: 2 }, [
          _ctx.$slots.extra ? {
            name: "extra-footer",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "extra")
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["value", "visible", "format", "use12-hours", "step", "disabled-hours", "disabled-minutes", "disabled-seconds", "hide-disabled-options", "hide-footer", "onSelect", "onConfirm"]))
      ], 2)
    ]),
    default: vue.withCtx(() => [
      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.isRange ? "DateRangeInput" : "DateInput"), vue.mergeProps({
        ..._ctx.$attrs,
        ..._ctx.inputProps
      }, {
        ref: "refInput",
        "input-value": _ctx.inputValue,
        value: _ctx.panelValue,
        size: _ctx.size,
        focused: _ctx.panelVisible,
        format: _ctx.computedFormat,
        visible: _ctx.panelVisible,
        disabled: _ctx.mergedDisabled,
        error: _ctx.error,
        readonly: _ctx.readonly,
        editable: !_ctx.readonly,
        "allow-clear": _ctx.allowClear && !_ctx.readonly,
        placeholder: _ctx.computedPlaceholder,
        onClear: _ctx.onInputClear
      }), vue.createSlots({
        "suffix-icon": vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "suffix-icon", {}, () => [
            vue.createVNode(_component_IconClockCircle)
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
      ]), 1040, ["input-value", "value", "size", "focused", "format", "visible", "disabled", "error", "readonly", "editable", "allow-clear", "placeholder", "onClear"]))
    ]),
    _: 3
  }, 16, ["position", "disabled", "popup-visible", "unmount-on-close", "popup-container", "onPopupVisibleChange"]);
}
var _TimePicker = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _TimePicker;
