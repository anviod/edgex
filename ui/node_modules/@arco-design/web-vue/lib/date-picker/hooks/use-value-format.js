"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
function getReturnValue(date, format) {
  if (format === "timestamp") {
    return date.toDate().getTime();
  }
  if (format === "Date") {
    return date.toDate();
  }
  return date.format(format);
}
function useReturnValue(props) {
  const { format } = vue.toRefs(props);
  return (date) => getReturnValue(date, format.value);
}
function getReturnRangeValue(dates, format) {
  return dates.map((date) => date ? getReturnValue(date, format) : void 0);
}
exports.getReturnRangeValue = getReturnRangeValue;
exports.getReturnValue = getReturnValue;
exports.useReturnValue = useReturnValue;
