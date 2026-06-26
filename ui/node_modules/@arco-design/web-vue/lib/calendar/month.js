"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var date = require("../_utils/date.js");
var pad = require("../_utils/pad.js");
var week = require("./week.js");
var useCellClassName = require("./hooks/useCellClassName.js");
var globalConfig = require("../_utils/global-config.js");
const allDaysInOnePage = 6 * 7;
const getReturn = (time) => {
  return {
    year: time.year(),
    month: time.month() + 1,
    date: time.date(),
    day: time.day(),
    time
  };
};
const getTimeObj = (time) => {
  return {
    start: getReturn(date.methods.startOf(time, "month")),
    end: getReturn(date.methods.endOf(time, "month")),
    days: time.daysInMonth()
  };
};
function getAllDaysByTime(time, {
  dayStartOfWeek = 0,
  isWeek
}) {
  const current = getTimeObj(time);
  const flatRows = Array(allDaysInOnePage).fill(null).map(() => ({}));
  const startIndex = dayStartOfWeek === 0 ? current.start.day : (current.start.day || 7) - 1;
  flatRows[startIndex] = {
    ...current.start,
    isCurrent: true
  };
  for (let i = 0; i < startIndex; i++) {
    flatRows[startIndex - i - 1] = {
      ...getReturn(date.methods.subtract(current.start.time, i + 1, "day")),
      isPrev: true
    };
  }
  for (let i = 0; i < allDaysInOnePage - startIndex - 1; i++) {
    flatRows[startIndex + i + 1] = {
      ...getReturn(date.methods.add(current.start.time, i + 1, "day")),
      isCurrent: i < current.days,
      isNext: i >= current.days - 1
    };
  }
  const rows = Array(6).fill(null).map(() => []);
  for (let i = 0; i < 6; i++) {
    rows[i] = flatRows.slice(i * 7, 7 * (i + 1));
    if (isWeek) {
      const weekTime = rows[i][0].time;
      const weekRows = [...rows[i]];
      rows[i].unshift({
        weekRows,
        weekOfYear: weekTime.week()
      });
    }
  }
  return rows;
}
var Month = vue.defineComponent({
  name: "Month",
  props: {
    cell: {
      type: Boolean
    },
    pageData: {
      type: Array
    },
    current: {
      type: Number
    },
    value: {
      type: Object,
      required: true
    },
    selectHandler: {
      type: Function,
      required: true
    },
    mode: {
      type: String
    },
    pageShowDate: {
      type: Object,
      required: true
    },
    panel: {
      type: Boolean
    },
    dayStartOfWeek: {
      type: Number,
      required: true
    },
    isWeek: {
      type: Boolean,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const {
      pageData
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("calendar");
    const pageShowDateYear = props.pageShowDate.year();
    const getCellClassName = vue.computed(() => useCellClassName({
      prefixCls,
      mergedValue: props.value,
      panel: false,
      innerMode: props.mode,
      rangeValues: [],
      hoverRangeValues: [],
      isSameTime: (current, target) => current.isSame(target, "day")
    }));
    function renderDays(row) {
      return row.map((col, index) => {
        var _a;
        if (col.time) {
          const onClickHandler = () => props.selectHandler(col.time, false);
          const tdProps = props.isWeek ? {
            onClick: onClickHandler
          } : {};
          const tdDivProps = !props.isWeek ? {
            onClick: onClickHandler
          } : {};
          return vue.createVNode("div", vue.mergeProps({
            "key": index,
            "class": getCellClassName.value(col, false)
          }, tdProps), [slots.default ? (_a = slots.default) == null ? void 0 : _a.call(slots, {
            year: col.year,
            month: col.month,
            date: col.date
          }) : vue.createVNode("div", vue.mergeProps({
            "class": `${prefixCls}-date`
          }, tdDivProps), [vue.createVNode("div", {
            "class": `${prefixCls}-date-value`
          }, [props.panel ? col.date : vue.createVNode("div", {
            "class": `${prefixCls}-date-circle`
          }, [col.date])])])]);
        }
        if ("weekOfYear" in col) {
          const rowYear = props.value.year();
          const rowMonth = props.value.month() + 1;
          const rowWeek = props.value.week();
          const selectedWeek = props.value && col.weekRows.find((r) => r.year === rowYear && r.month === rowMonth) && rowWeek === col.weekOfYear;
          return vue.createVNode("div", {
            "key": index,
            "class": [`${prefixCls}-cell`, `${prefixCls}-cell-week`, {
              [`${prefixCls}-cell-selected-week`]: selectedWeek,
              [`${prefixCls}-cell-in-range`]: selectedWeek
            }]
          }, [vue.createVNode("div", {
            "class": `${prefixCls}-date`
          }, [vue.createVNode("div", {
            "class": `${prefixCls}-date-value`
          }, [col.weekOfYear])])]);
        }
        return null;
      });
    }
    let pd = pageData.value;
    if (typeof props.current === "number") {
      pd = getAllDaysByTime(date.dayjs(`${pageShowDateYear}-${pad.padStart(props.current + 1, 2, "0")}-01`), {
        dayStartOfWeek: props.dayStartOfWeek,
        isWeek: props.isWeek
      });
    }
    return () => vue.createVNode("div", {
      "class": props.cell ? `${prefixCls}-month-cell` : `${prefixCls}-month`
    }, [vue.createVNode(week, {
      "value": props.value,
      "selectHandler": props.selectHandler,
      "dayStartOfWeek": props.dayStartOfWeek,
      "isWeek": props.isWeek,
      "panel": props.panel,
      "mode": props.mode,
      "pageShowData": props.pageShowDate,
      "pageData": props.pageData
    }, null), vue.createVNode("div", {
      "class": `${prefixCls}-month-cell-body`
    }, [pd == null ? void 0 : pd.map((row, index) => vue.createVNode("div", {
      "key": index,
      "class": [`${prefixCls}-month-row`, {
        [`${prefixCls}-row-week`]: props.isWeek
      }]
    }, [renderDays(row)]))])]);
  }
});
exports["default"] = Month;
exports.getAllDaysByTime = getAllDaysByTime;
