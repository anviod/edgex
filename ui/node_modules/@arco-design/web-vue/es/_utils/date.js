import originDayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import weekYear from "dayjs/plugin/weekYear";
import QuarterOfYear from "dayjs/plugin/quarterOfYear";
import { isDayjs, isArray, isQuarter } from "./is.js";
import "dayjs/locale/zh-cn";
const overwriteIsDayjs = (_, Dayjs2, dayjs2) => {
  dayjs2 = function(date, c) {
    if (isDayjs(date)) {
      return date.clone();
    }
    const cfg = typeof c === "object" ? c : {};
    cfg.date = date;
    cfg.args = arguments;
    return new Dayjs2(cfg);
  };
  const proto = Dayjs2.prototype;
  const old$Utils = proto.$utils;
  proto.$utils = () => {
    const newUtils = old$Utils();
    newUtils.i = isDayjs;
    return newUtils;
  };
  dayjs2.isDayjs = isDayjs;
};
originDayjs.extend(overwriteIsDayjs);
originDayjs.extend(customParseFormat);
originDayjs.extend(isBetween);
originDayjs.extend(weekOfYear);
originDayjs.extend(AdvancedFormat);
originDayjs.extend(weekYear);
originDayjs.extend(QuarterOfYear);
const dayjs = originDayjs;
const methods = {
  add(time, value, unit) {
    return time.add(value, unit);
  },
  subtract(time, value, unit) {
    return time.subtract(value, unit);
  },
  startOf(time, unit) {
    return time.startOf(unit);
  },
  startOfWeek(time, weekStart) {
    const currentDay = time.day();
    let startOfWeek = time.subtract(currentDay - weekStart, "day");
    if (startOfWeek.isAfter(time)) {
      startOfWeek = startOfWeek.subtract(7, "day");
    }
    return startOfWeek;
  },
  endOf(time, unit) {
    return time.endOf(unit);
  },
  set(time, unit, value) {
    return time.set(unit, value);
  },
  isSameWeek(date1, date2, weekStart) {
    const getWeek = (date) => {
      const day = date.day();
      const diff = day - weekStart + (day < weekStart ? 7 : 0);
      return date.subtract(diff, "day").week();
    };
    return getWeek(date1) === getWeek(date2);
  }
};
function getNow() {
  return dayjs();
}
function getSortedDayjsArray(values) {
  return [...values].sort((a, b) => a.valueOf() - b.valueOf());
}
function isValueChange(prevValue, currentValue) {
  const isDifference = (value1, value2) => {
    if (value1 === void 0 && value2 === void 0) {
      return false;
    }
    if (value1 && !value2 || !value1 && value2) {
      return true;
    }
    return (value1 == null ? void 0 : value1.valueOf()) !== (value2 == null ? void 0 : value2.valueOf());
  };
  if (currentValue === void 0 && prevValue === void 0) {
    return false;
  }
  if (isArray(currentValue) && isArray(prevValue)) {
    return isDifference(currentValue[0], prevValue[0]) || isDifference(currentValue[1], prevValue[1]);
  }
  if (!isArray(currentValue) && !isArray(prevValue)) {
    return isDifference(currentValue, prevValue);
  }
  return true;
}
function getDayjsValue(time, format) {
  const parseQuarterToMonth = (value) => {
    const reg = /(Q1)|(Q2)|(Q3)|(Q4)/;
    const quarter = {
      Q1: "01",
      Q2: "04",
      Q3: "07",
      Q4: "10"
    };
    const [q] = reg.exec(value);
    return value.replace(reg, quarter[q]);
  };
  const formatValue = (value) => {
    if (!value)
      return void 0;
    if (typeof value === "string") {
      if (isQuarter(format)) {
        return dayjs(parseQuarterToMonth(value), format.replace(/\[Q]Q/, "MM"));
      }
      if (dayjs(value, format).isValid()) {
        return dayjs(value, format);
      }
    }
    return dayjs(value);
  };
  if (isArray(time)) {
    return time.map(formatValue);
  }
  return formatValue(time);
}
function getDateValue(value) {
  const formatValue = (t) => t ? t.toDate() : void 0;
  if (isArray(value)) {
    return value.map(formatValue);
  }
  return formatValue(value);
}
function initializeDateLocale(localeName, weekStart) {
  dayjs.locale({ ...dayjs.Ls[localeName.toLocaleLowerCase()], weekStart });
}
function pickDataAttributes(obj) {
  const clone = {};
  obj && Object.keys(obj).forEach((key) => {
    const k = String(key);
    if (k.indexOf("data-") === 0) {
      clone[k] = obj[k];
    }
    if (k.indexOf("aria-") === 0) {
      clone[k] = obj[k];
    }
  });
  return clone;
}
export { dayjs, getDateValue, getDayjsValue, getNow, getSortedDayjsArray, initializeDateLocale, isValueChange, methods, pickDataAttributes };
