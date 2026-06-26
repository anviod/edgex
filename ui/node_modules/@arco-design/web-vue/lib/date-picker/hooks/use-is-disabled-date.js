"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
function useIsDisabledDate(props) {
  const { mode, showTime, disabledDate, disabledTime, isRange } = vue.toRefs(props);
  const needCheckTime = vue.computed(
    () => (mode == null ? void 0 : mode.value) === "date" && (showTime == null ? void 0 : showTime.value)
  );
  const isDisabledDate = vue.computed(() => {
    return (current, type) => {
      if (!(disabledDate == null ? void 0 : disabledDate.value))
        return false;
      const dateValue = date.getDateValue(current);
      if (isRange == null ? void 0 : isRange.value)
        return disabledDate.value(dateValue, type);
      return disabledDate.value(dateValue);
    };
  });
  const isDisabledItem = (num, getDisabledList) => {
    const list = (getDisabledList == null ? void 0 : getDisabledList()) || [];
    return list.includes(num);
  };
  const isDisabledTime = vue.computed(() => {
    return (current, type) => {
      if (!needCheckTime.value)
        return false;
      if (!(disabledTime == null ? void 0 : disabledTime.value))
        return false;
      const dateValue = date.getDateValue(current);
      const disabledTimeProps = (isRange == null ? void 0 : isRange.value) ? disabledTime.value(dateValue, type) : disabledTime.value(dateValue);
      return isDisabledItem(current.hour(), disabledTimeProps.disabledHours) || isDisabledItem(current.minute(), disabledTimeProps.disabledMinutes) || isDisabledItem(current.second(), disabledTimeProps.disabledSeconds);
    };
  });
  return function isDisabled(value, type) {
    return value && (isDisabledDate.value(value, type || "start") || isDisabledTime.value(value, type || "start"));
  };
}
module.exports = useIsDisabledDate;
