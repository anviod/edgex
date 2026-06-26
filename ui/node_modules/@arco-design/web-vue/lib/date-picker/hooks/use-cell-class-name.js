"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
var is = require("../../_utils/is.js");
function useCellClassName(props) {
  const { rangeValues } = vue.toRefs(props);
  const sortedRangeValues = vue.computed(
    () => (rangeValues == null ? void 0 : rangeValues.value) && rangeValues.value.every(is.isDayjs) ? date.getSortedDayjsArray(rangeValues.value) : rangeValues == null ? void 0 : rangeValues.value
  );
  const rangeStart = vue.computed(() => {
    var _a;
    return (_a = sortedRangeValues.value) == null ? void 0 : _a[0];
  });
  const rangeEnd = vue.computed(() => {
    var _a;
    return (_a = sortedRangeValues.value) == null ? void 0 : _a[1];
  });
  return {
    getCellClassName: (cellData, disabled) => {
      const { value, isSameTime, mode, prefixCls } = props;
      const isInView = !cellData.isPrev && !cellData.isNext;
      const isSelected = value && isSameTime(cellData.value, value);
      let isToday = isSameTime(cellData.value, date.getNow());
      if (mode === "week") {
        isToday = date.getNow().isSame(cellData.value, "date");
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
module.exports = useCellClassName;
