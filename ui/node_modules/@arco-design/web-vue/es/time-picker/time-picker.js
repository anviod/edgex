import { defineComponent, toRefs, computed, ref, reactive, watch, nextTick, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createElementVNode, normalizeClass, resolveDynamicComponent, createSlots, renderSlot, createVNode } from "vue";
import { getDateValue, dayjs, getSortedDayjsArray, isValueChange } from "../_utils/date.js";
import { isUndefined, isArray } from "../_utils/is.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Trigger from "../trigger/index.js";
import DateInput from "../_components/picker/input.js";
import DateRangeInput from "../_components/picker/input-range.js";
import IconClockCircle from "../icon/icon-clock-circle/index.js";
import useState from "../_hooks/use-state.js";
import useTimeFormat from "./hooks/use-time-format.js";
import useTimeState from "./hooks/use-time-state.js";
import { getFormattedValue, isValidRangeValue, isValidInputValue } from "./utils/index.js";
import Panel from "./panel.js";
import RangePanel from "./range-panel.js";
import useIsDisabledTime from "./hooks/use-is-disabled-time.js";
import useMergeState from "../_hooks/use-merge-state.js";
import { useI18n } from "../locale/index.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TimePicker",
  components: {
    Trigger,
    DateInput,
    DateRangeInput,
    Panel,
    RangePanel,
    IconClockCircle
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
    } = toRefs(props);
    const { mergedDisabled, eventHandlers } = useFormItem({ disabled });
    const isRange = computed(() => type.value === "time-range");
    const prefixCls = getPrefixCls("timepicker");
    const refInput = ref();
    const { format: computedFormat, use12Hours: computedUse12Hours } = useTimeFormat(
      reactive({
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
      reactive({
        modelValue,
        defaultValue,
        isRange,
        format: computedFormat
      })
    );
    const [panelVisible, setLocalVisible] = useMergeState(
      defaultPopupVisible.value,
      reactive({ value: popupVisible })
    );
    const setPanelVisible = (newVisible) => {
      if (newVisible !== panelVisible.value) {
        setLocalVisible(newVisible);
        emit("popup-visible-change", newVisible);
        emit("update:popupVisible", newVisible);
      }
    };
    const { t } = useI18n();
    const [focusedInputIndex, setFocusedInputIndex] = useState(0);
    const computedPlaceholder = computed(() => {
      const _placeholder = placeholder == null ? void 0 : placeholder.value;
      if (!isRange.value) {
        return !isUndefined(_placeholder) ? _placeholder : t("datePicker.placeholder.time");
      }
      if (isUndefined(_placeholder)) {
        return t("datePicker.rangePlaceholder.time");
      }
      if (!isArray(_placeholder)) {
        return [_placeholder, _placeholder];
      }
      return _placeholder;
    });
    const isDisabledTime = useIsDisabledTime(
      reactive({
        disabledHours,
        disabledMinutes,
        disabledSeconds
      })
    );
    function emitChange(value) {
      var _a, _b;
      if (isValueChange(value, computedValue.value)) {
        const formattedValue = getFormattedValue(value, computedFormat.value);
        const dateValue = getDateValue(value);
        emit("update:modelValue", formattedValue);
        emit("change", formattedValue, dateValue);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      }
    }
    function confirm(value, showPanel) {
      if (isDisabledTime(value))
        return;
      let newValue = value;
      if (isArray(value)) {
        const now = dayjs();
        newValue = value.map((item) => {
          if (item) {
            item = item.year(now.year());
            item = item.month(now.month());
            item = item.date(now.date());
          }
          return item;
        });
        if (isValidRangeValue(newValue)) {
          newValue = getSortedDayjsArray(newValue);
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
    function focusInput(index) {
      refInput.value && refInput.value.focus && refInput.value.focus(index);
    }
    function onPanelVisibleChange(newVisible) {
      if (mergedDisabled.value)
        return;
      setPanelVisible(newVisible);
      if (newVisible) {
        nextTick(() => {
          focusInput(focusedInputIndex.value);
        });
      }
    }
    function onPanelSelect(value) {
      const formattedValue = getFormattedValue(value, computedFormat.value);
      const dateValue = getDateValue(value);
      emit("select", formattedValue, dateValue);
      if (disableConfirm.value && (!isRange.value || isValidRangeValue(value))) {
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
      if (isValidRangeValue(panelValue.value)) {
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
      if (!isValidInputValue(targetValue, computedFormat.value))
        return;
      const newValue = dayjs(targetValue, computedFormat.value);
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
      const newInputValue = isArray(inputValue.value) ? [...inputValue.value] : isArray(panelValue.value) && getFormattedValue(panelValue.value, computedFormat.value) || [];
      newInputValue[focusedInputIndex.value] = targetValue;
      setInputValue(newInputValue);
      if (!isValidInputValue(targetValue, computedFormat.value))
        return;
      const targetValueDayjs = dayjs(targetValue, computedFormat.value);
      if (isDisabledTime(targetValueDayjs))
        return;
      const newValue = isArray(panelValue.value) ? [...panelValue.value] : [];
      newValue[focusedInputIndex.value] = targetValueDayjs;
      if (disableConfirm.value && isValidRangeValue(newValue)) {
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
    watch(panelVisible, (curVal, preVal) => {
      if (curVal !== preVal) {
        setPanelValue(computedValue.value);
      }
      if (!curVal) {
        setInputValue(void 0);
      }
    });
    const inputProps = computed(() => {
      if (isRange.value) {
        return {
          focusedIndex: focusedInputIndex.value,
          onFocusedIndexChange: (index) => {
            setFocusedInputIndex(index);
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
    const panelProps = computed(() => {
      if (isRange.value) {
        return {
          displayIndex: focusedInputIndex.value,
          onDisplayIndexChange: (index) => {
            setFocusedInputIndex(index);
            focusInput(index);
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
  const _component_IconClockCircle = resolveComponent("IconClockCircle");
  const _component_Trigger = resolveComponent("Trigger");
  return openBlock(), createBlock(_component_Trigger, mergeProps({
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
    content: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-container`),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onPanelClick && _ctx.onPanelClick(...args))
      }, [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.isRange ? "RangePanel" : "Panel"), mergeProps(_ctx.panelProps, {
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
        }), createSlots({ _: 2 }, [
          _ctx.$slots.extra ? {
            name: "extra-footer",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "extra")
            ]),
            key: "0"
          } : void 0
        ]), 1040, ["value", "visible", "format", "use12-hours", "step", "disabled-hours", "disabled-minutes", "disabled-seconds", "hide-disabled-options", "hide-footer", "onSelect", "onConfirm"]))
      ], 2)
    ]),
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent(_ctx.isRange ? "DateRangeInput" : "DateInput"), mergeProps({
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
      }), createSlots({
        "suffix-icon": withCtx(() => [
          renderSlot(_ctx.$slots, "suffix-icon", {}, () => [
            createVNode(_component_IconClockCircle)
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
      ]), 1040, ["input-value", "value", "size", "focused", "format", "visible", "disabled", "error", "readonly", "editable", "allow-clear", "placeholder", "onClear"]))
    ]),
    _: 3
  }, 16, ["position", "disabled", "popup-visible", "unmount-on-close", "popup-container", "onPopupVisibleChange"]);
}
var _TimePicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _TimePicker as default };
