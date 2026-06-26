import { toRefs, computed, reactive } from "vue";
import { isArray } from "../../_utils/is.js";
import useTimePickerValue from "./use-time-picker-value.js";
function useRangeTimePickerValue(props) {
  const { timePickerProps, selectedValue } = toRefs(props);
  const startValue = computed(() => {
    var _a;
    return (_a = selectedValue == null ? void 0 : selectedValue.value) == null ? void 0 : _a[0];
  });
  const endValue = computed(() => {
    var _a;
    return (_a = selectedValue == null ? void 0 : selectedValue.value) == null ? void 0 : _a[1];
  });
  const timePickerDefaultValue = computed(
    () => {
      var _a;
      return (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.defaultValue;
    }
  );
  const startTimePickerProps = computed(
    () => isArray(timePickerDefaultValue.value) ? {
      ...timePickerProps == null ? void 0 : timePickerProps.value,
      defaultValue: timePickerDefaultValue.value[0]
    } : timePickerProps == null ? void 0 : timePickerProps.value
  );
  const endTimePickerProps = computed(
    () => isArray(timePickerDefaultValue.value) ? {
      ...timePickerProps == null ? void 0 : timePickerProps.value,
      defaultValue: timePickerDefaultValue.value[1]
    } : timePickerProps == null ? void 0 : timePickerProps.value
  );
  const [startTimeValue, setStartTimeValue, resetStartTimeValue] = useTimePickerValue(
    reactive({
      timePickerProps: startTimePickerProps,
      selectedValue: startValue
    })
  );
  const [endTimeValue, setEndTimeValue, resetEndTimeValue] = useTimePickerValue(
    reactive({
      timePickerProps: endTimePickerProps,
      selectedValue: endValue
    })
  );
  const rangeTimePickerValue = computed(() => [
    startTimeValue.value,
    endTimeValue.value
  ]);
  function setTimeValue(val) {
    if (!val)
      return;
    setStartTimeValue(val[0]);
    setEndTimeValue(val[1]);
  }
  function resetTimeValue() {
    resetStartTimeValue();
    resetEndTimeValue();
  }
  return [rangeTimePickerValue, setTimeValue, resetTimeValue];
}
export { useRangeTimePickerValue as default };
