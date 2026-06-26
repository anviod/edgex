import { toRefs, computed } from "vue";
import { getDateValue } from "../../_utils/date.js";
function useIsDisabledDate(props) {
  const { mode, showTime, disabledDate, disabledTime, isRange } = toRefs(props);
  const needCheckTime = computed(
    () => (mode == null ? void 0 : mode.value) === "date" && (showTime == null ? void 0 : showTime.value)
  );
  const isDisabledDate = computed(() => {
    return (current, type) => {
      if (!(disabledDate == null ? void 0 : disabledDate.value))
        return false;
      const dateValue = getDateValue(current);
      if (isRange == null ? void 0 : isRange.value)
        return disabledDate.value(dateValue, type);
      return disabledDate.value(dateValue);
    };
  });
  const isDisabledItem = (num, getDisabledList) => {
    const list = (getDisabledList == null ? void 0 : getDisabledList()) || [];
    return list.includes(num);
  };
  const isDisabledTime = computed(() => {
    return (current, type) => {
      if (!needCheckTime.value)
        return false;
      if (!(disabledTime == null ? void 0 : disabledTime.value))
        return false;
      const dateValue = getDateValue(current);
      const disabledTimeProps = (isRange == null ? void 0 : isRange.value) ? disabledTime.value(dateValue, type) : disabledTime.value(dateValue);
      return isDisabledItem(current.hour(), disabledTimeProps.disabledHours) || isDisabledItem(current.minute(), disabledTimeProps.disabledMinutes) || isDisabledItem(current.second(), disabledTimeProps.disabledSeconds);
    };
  });
  return function isDisabled(value, type) {
    return value && (isDisabledDate.value(value, type || "start") || isDisabledTime.value(value, type || "start"));
  };
}
export { useIsDisabledDate as default };
