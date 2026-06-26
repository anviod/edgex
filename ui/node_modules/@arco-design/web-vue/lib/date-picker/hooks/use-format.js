"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
function getDefaultFormat(mode = "date", showTime = false) {
  switch (mode) {
    case "date":
      return showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    case "week":
      return "gggg-wo";
    case "quarter":
      return "YYYY-[Q]Q";
    default:
      return "YYYY-MM-DD";
  }
}
function getDefaultValueFormat(mode = "date", showTime = false) {
  switch (mode) {
    case "date":
      return showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
    case "month":
      return "YYYY-MM";
    case "year":
      return "YYYY";
    case "week":
      return "YYYY-MM-DD";
    case "quarter":
      return "YYYY-MM";
    default:
      return "YYYY-MM-DD";
  }
}
function useFormat(props) {
  const {
    format: propFormat,
    mode,
    showTime,
    valueFormat: propValueFormat
  } = vue.toRefs(props);
  const format = vue.computed(
    () => !is.isFunction(propFormat == null ? void 0 : propFormat.value) && (propFormat == null ? void 0 : propFormat.value) || getDefaultFormat(mode == null ? void 0 : mode.value, showTime == null ? void 0 : showTime.value)
  );
  const valueFormat = vue.computed(
    () => (propValueFormat == null ? void 0 : propValueFormat.value) || getDefaultValueFormat(mode == null ? void 0 : mode.value, showTime == null ? void 0 : showTime.value)
  );
  const parseValueFormat = vue.computed(
    () => ["timestamp", "Date"].includes(valueFormat.value) ? format.value : valueFormat.value
  );
  return {
    format,
    valueFormat,
    parseValueFormat
  };
}
exports["default"] = useFormat;
exports.getDefaultFormat = getDefaultFormat;
exports.getDefaultValueFormat = getDefaultValueFormat;
