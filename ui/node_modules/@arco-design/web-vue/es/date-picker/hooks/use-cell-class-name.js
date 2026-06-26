import { toRefs, computed } from "vue";
import { getSortedDayjsArray, getNow } from "../../_utils/date.js";
import { isDayjs } from "../../_utils/is.js";
function useCellClassName(props) {
  const { rangeValues } = toRefs(props);
  const sortedRangeValues = computed(
    () => (rangeValues == null ? void 0 : rangeValues.value) && rangeValues.value.every(isDayjs) ? getSortedDayjsArray(rangeValues.value) : rangeValues == null ? void 0 : rangeValues.value
  );
  const rangeStart = computed(() => {
    var _a;
    return (_a = sortedRangeValues.value) == null ? void 0 : _a[0];
  });
  const rangeEnd = computed(() => {
    var _a;
    return (_a = sortedRangeValues.value) == null ? void 0 : _a[1];
  });
  return {
    getCellClassName: (cellData, disabled) => {
      const { value, isSameTime, mode, prefixCls } = props;
      const isInView = !cellData.isPrev && !cellData.isNext;
      const isSelected = value && isSameTime(cellData.value, value);
      let isToday = isSameTime(cellData.value, getNow());
      if (mode === "week") {
        isToday = getNow().isSame(cellData.value, "date");
      }
      const isRangeStart = isInView && rangeStart.value && isSameTime(cellData.value, rangeStart.value);
      const isRangeEnd = isInView && rangeEnd.value && isSameTime(cellData.value, rangeEnd.value);
      const isInRange = isInView && rangeStart.value && rangeEnd.value && (isRangeStart || isRangeEnd || cellData.value.isBetween(
        rangeStart.value,
        rangeEnd.value,
        null,
        "[]"
      ));
      return [
        `${prefixCls}-cell`,
        {
          [`${prefixCls}-cell-in-view`]: isInView,
          [`${prefixCls}-cell-today`]: isToday,
          [`${prefixCls}-cell-selected`]: isSelected,
          [`${prefixCls}-cell-range-start`]: isRangeStart,
          [`${prefixCls}-cell-range-end`]: isRangeEnd,
          [`${prefixCls}-cell-in-range`]: isInRange,
          [`${prefixCls}-cell-disabled`]: disabled
        },
        cellData.classNames
      ];
    }
  };
}
export { useCellClassName as default };
