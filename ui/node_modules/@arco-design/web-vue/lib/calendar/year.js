"use strict";
var vue = require("vue");
var pad = require("../_utils/pad.js");
var date = require("../_utils/date.js");
var month = require("./month.js");
var useCellClassName = require("./hooks/useCellClassName.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../locale/index.js");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month2, index2) => {
  return {
    name: month2,
    value: index2
  };
});
const monthGroup = Array(3);
for (let i = 0; i < 3; i++) {
  monthGroup[i] = MONTHS.slice(i * 4, 4 * (i + 1));
}
const monthGroupPanel = Array(4);
for (let i = 0; i < 4; i++) {
  monthGroupPanel[i] = MONTHS.slice(i * 3, 3 * (i + 1));
}
var Year = vue.defineComponent({
  name: "Year",
  props: {
    mode: {
      type: String,
      required: true
    },
    dayStartOfWeek: {
      type: Number,
      required: true
    },
    value: {
      type: Object,
      required: true
    },
    isWeek: {
      type: Boolean
    },
    panel: {
      type: Boolean,
      default: false
    },
    pageShowData: {
      type: Object,
      required: true
    },
    pageData: {
      type: Array
    },
    selectHandler: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("calendar");
    const getCellClassName = vue.computed(() => useCellClassName({
      prefixCls,
      mergedValue: props.value,
      panel: false,
      innerMode: props.mode,
      rangeValues: [],
      hoverRangeValues: [],
      isSameTime: (current, target) => current.isSame(target, "month")
    }));
    const {
      t
    } = index.useI18n();
    const showYear = vue.computed(() => props.pageShowData.year());
    const mg = props.panel ? monthGroupPanel : monthGroup;
    return () => vue.createVNode("div", {
      "class": `${prefixCls}-year`
    }, [mg.map((row, rowIndex) => vue.createVNode("div", {
      "class": `${prefixCls}-year-row`,
      "key": rowIndex
    }, [row.map((col) => {
      const time = date.dayjs(`${showYear.value}-${pad.padStart(col.value + 1, 2, "0")}-01`);
      const divProps = props.panel ? {
        onClick: () => props.selectHandler(time, false)
      } : {};
      return vue.createVNode("div", {
        "key": col.value,
        "class": getCellClassName.value({
          ...col,
          time
        }, false)
      }, [props.panel ? vue.createVNode("div", vue.mergeProps({
        "class": `${prefixCls}-date`
      }, divProps), [vue.createVNode("div", {
        "class": `${prefixCls}-date-value`
      }, [t(`calendar.month.short.${col.name}`)])]) : vue.createVNode("div", {
        "class": `${prefixCls}-month-with-days`
      }, [vue.createVNode("div", {
        "class": `${prefixCls}-month-title`
      }, [t(`calendar.month.long.${col.name}`)]), vue.createVNode(month["default"], {
        "pageShowDate": props.pageShowData,
        "pageData": props.pageData,
        "dayStartOfWeek": props.dayStartOfWeek,
        "selectHandler": props.selectHandler,
        "isWeek": props.isWeek,
        "cell": true,
        "current": col.value,
        "value": props.value,
        "mode": props.mode
      }, null)])]);
    })]))]);
  }
});
module.exports = Year;
