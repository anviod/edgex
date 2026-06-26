"use strict";
var vue = require("vue");
var is = require("../../_utils/is.js");
var useTimePickerValue = require("./use-time-picker-value.js");
function useRangeTimePickerValue(props) {
  const { timePickerProps, selectedValue } = vue.toRefs(props);
  const startValue = vue.computed(() => {
    var _a;
    return (_a = selectedValue == null ? void 0 : selectedValue.value) == null ? void 0 : _a[0];
  });
  const endValue = vue.computed(() => {
    var _a;
    return (_a = selectedValue == null ? void 0 : selectedValue.value) == null ? void 0 : _a[1];
  });
  const timePickerDefaultValue = vue.computed(
    () => {
      var _a;
      return (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.defaultValue;
    }
  );
  const startTimePickerProps = vue.computed(
    () => is.isArray(timePickerDefaultValue.value) ? {
      ...timePickerProps == null ? void 0 : timePickerProps.value,
      defaultValue: timePickerDefaultValue.value[0]
    } : timePickerProps == null ? void 0 : timePickerProps.value
  );
  const endTimePickerProps = vue.computed(
    () => is.isArray(timePickerDefaultValue.value) ? {
      ...timePickerProps == null ? void 0 : timePickerProps.value,
      defaultValue: timePickerDefaultValue.value[1]
    } : timePickerProps == null ? void 0 : timePickerProps.value
  );
  const [startTimeValue, setStartTimeValue, resetStartTimeValue] = useTimePickerValue(
    vue.reactive({
      timePickerProps: startTimePickerProps,
      selectedValue: startValue
    })
  );
  const [endTimeValue, setEndTimeValue, resetEndTimeValue] = useTimePickerValue(
    vue.reactive({
      timePickerProps: endTimePickerProps,
      selectedValue: endValue
    })
  );
  const rangeTimePickerValue = vue.computed(() => [
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
module.exports = useRangeTimePickerValue;
