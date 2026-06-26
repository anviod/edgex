import { toRefs, computed } from "vue";
import { isFunction } from "../../_utils/is.js";
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
  } = toRefs(props);
  const format = computed(
    () => !isFunction(propFormat == null ? void 0 : propFormat.value) && (propFormat == null ? void 0 : propFormat.value) || getDefaultFormat(mode == null ? void 0 : mode.value, showTime == null ? void 0 : showTime.value)
  );
  const valueFormat = computed(
    () => (propValueFormat == null ? void 0 : propValueFormat.value) || getDefaultValueFormat(mode == null ? void 0 : mode.value, showTime == null ? void 0 : showTime.value)
  );
  const parseValueFormat = computed(
    () => ["timestamp", "Date"].includes(valueFormat.value) ? format.value : valueFormat.value
  );
  return {
    format,
    valueFormat,
    parseValueFormat
  };
}
export { useFormat as default, getDefaultFormat, getDefaultValueFormat };
