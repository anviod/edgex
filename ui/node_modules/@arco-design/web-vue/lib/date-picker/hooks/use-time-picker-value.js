"use strict";
var vue = require("vue");
var useTimeFormat = require("../../time-picker/hooks/use-time-format.js");
var date = require("../../_utils/date.js");
function useTimePickerValue(props) {
  const { timePickerProps, selectedValue } = vue.toRefs(props);
  const timePickerPropsFormat = vue.computed(() => {
    var _a;
    return (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.format;
  });
  const timePickerPropsUse12Hours = vue.computed(
    () => {
      var _a;
      return !!((_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.use12Hours);
    }
  );
  const { format } = useTimeFormat(
    vue.reactive({
      format: timePickerPropsFormat,
      use12Hours: timePickerPropsUse12Hours
    })
  );
  const defaultTimePickerValue = vue.computed(
    () => {
      var _a;
      return date.getDayjsValue(
        (_a = timePickerProps == null ? void 0 : timePickerProps.value) == null ? void 0 : _a.defaultValue,
        format.value
      );
    }
  );
  const getDefaultValue = () => (selectedValue == null ? void 0 : selectedValue.value) || defaultTimePickerValue.value || date.getNow();
  const timePickerValue = vue.ref(getDefaultValue());
  function setTimePickerValue(val) {
    if (val) {
      timePickerValue.value = val;
    }
  }
  function resetTimePickerValue() {
    timePickerValue.value = getDefaultValue();
  }
  vue.watch(selectedValue, (newVal) => {
    setTimePickerValue(newVal);
  });
  return [timePickerValue, setTimePickerValue, resetTimePickerValue];
}
module.exports = useTimePickerValue;
