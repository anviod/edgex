import { toRefs } from "vue";
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
  const { format } = toRefs(props);
  return (date) => getReturnValue(date, format.value);
}
function getReturnRangeValue(dates, format) {
  return dates.map((date) => date ? getReturnValue(date, format) : void 0);
}
export { getReturnRangeValue, getReturnValue, useReturnValue };
