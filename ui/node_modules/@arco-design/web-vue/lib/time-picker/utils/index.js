"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var BTween = require("b-tween");
var date = require("../../_utils/date.js");
var is = require("../../_utils/is.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var BTween__default = /* @__PURE__ */ _interopDefaultLegacy(BTween);
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
  if (!is.isUndefined(scrollId)) {
    cancelAnimationFrame(scrollId);
  }
  if (duration <= 0) {
    element.scrollTop = to;
  }
  scrollIds.set(
    element,
    requestAnimationFrame(() => {
      const tween = new BTween__default["default"]({
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
    if (is.isArray(time2)) {
      return time2.map((t) => formatValue(t));
    }
    if (is.isUndefined(time2))
      return void 0;
    return time2.format(format);
  };
  return formatValue(time);
}
function isValidRangeValue(value) {
  if (is.isUndefined(value))
    return true;
  if (!is.isArray(value))
    return false;
  return value.length === 0 || value.length === 2 && is.isDayjs(value[0]) && is.isDayjs(value[1]);
}
function isValidInputValue(time, format) {
  if (!time)
    return false;
  return typeof time === "string" && date.dayjs(time, format).format(format) === time;
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
    return !is.isUndefined(num) && disabledList.includes(num);
  };
  return isDisabledItem(hour, disabledHourList) || isDisabledItem(minute, disabledMinuteList) || isDisabledItem(second, disabledSecondList);
}
exports.getColumnsFromFormat = getColumnsFromFormat;
exports.getFormattedValue = getFormattedValue;
exports.isDisabledTime = isDisabledTime;
exports.isValidInputValue = isValidInputValue;
exports.isValidRangeValue = isValidRangeValue;
exports.scrollTo = scrollTo;
