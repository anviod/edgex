import BTween from "b-tween";
import { dayjs } from "../../_utils/date.js";
import { isUndefined, isArray, isDayjs } from "../../_utils/is.js";
function getColumnsFromFormat(format) {
  const units = ["H", "h", "m", "s", "a", "A"];
  const list = [];
  let use12Hours = false;
  units.forEach((unit) => {
    if (format.indexOf(unit) !== -1) {
      list.push(unit);
      if (unit === "a" || unit === "A") {
        use12Hours = true;
      }
    }
  });
  return {
    list,
    use12Hours
  };
}
const scrollIds = /* @__PURE__ */ new Map();
function scrollTo(element, to, duration) {
  const scrollId = scrollIds.get(element);
  if (!isUndefined(scrollId)) {
    cancelAnimationFrame(scrollId);
  }
  if (duration <= 0) {
    element.scrollTop = to;
  }
  scrollIds.set(
    element,
    requestAnimationFrame(() => {
      const tween = new BTween({
        from: { scrollTop: element.scrollTop },
        to: { scrollTop: to },
        duration,
        onUpdate: (keys) => {
          element.scrollTop = keys.scrollTop;
        }
      });
      tween.start();
    })
  );
}
function getFormattedValue(time, format) {
  const formatValue = (time2) => {
    if (isArray(time2)) {
      return time2.map((t) => formatValue(t));
    }
    if (isUndefined(time2))
      return void 0;
    return time2.format(format);
  };
  return formatValue(time);
}
function isValidRangeValue(value) {
  if (isUndefined(value))
    return true;
  if (!isArray(value))
    return false;
  return value.length === 0 || value.length === 2 && isDayjs(value[0]) && isDayjs(value[1]);
}
function isValidInputValue(time, format) {
  if (!time)
    return false;
  return typeof time === "string" && dayjs(time, format).format(format) === time;
}
function isDisabledTime(value, {
  disabledHours,
  disabledMinutes,
  disabledSeconds
}) {
  if (!value)
    return false;
  const hour = value.hour();
  const minute = value.minute();
  const second = value.second();
  const disabledHourList = (disabledHours == null ? void 0 : disabledHours()) || [];
  const disabledMinuteList = (disabledMinutes == null ? void 0 : disabledMinutes(hour)) || [];
  const disabledSecondList = (disabledSeconds == null ? void 0 : disabledSeconds(hour, minute)) || [];
  const isDisabledItem = (num, disabledList) => {
    return !isUndefined(num) && disabledList.includes(num);
  };
  return isDisabledItem(hour, disabledHourList) || isDisabledItem(minute, disabledMinuteList) || isDisabledItem(second, disabledSecondList);
}
export { getColumnsFromFormat, getFormattedValue, isDisabledTime, isValidInputValue, isValidRangeValue, scrollTo };
