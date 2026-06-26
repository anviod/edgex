import { defineComponent, computed, createVNode, mergeProps } from "vue";
import { padStart } from "../_utils/pad.js";
import { dayjs } from "../_utils/date.js";
import Month from "./month.js";
import useClassName from "./hooks/useCellClassName.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useI18n } from "../locale/index.js";
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => {
  return {
    name: month,
    value: index
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
var Year = defineComponent({
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
    const prefixCls = getPrefixCls("calendar");
    const getCellClassName = computed(() => useClassName({
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
    } = useI18n();
    const showYear = computed(() => props.pageShowData.year());
    const mg = props.panel ? monthGroupPanel : monthGroup;
    return () => createVNode("div", {
      "class": `${prefixCls}-year`
    }, [mg.map((row, rowIndex) => createVNode("div", {
      "class": `${prefixCls}-year-row`,
      "key": rowIndex
    }, [row.map((col) => {
      const time = dayjs(`${showYear.value}-${padStart(col.value + 1, 2, "0")}-01`);
      const divProps = props.panel ? {
        onClick: () => props.selectHandler(time, false)
      } : {};
      return createVNode("div", {
        "key": col.value,
        "class": getCellClassName.value({
          ...col,
          time
        }, false)
      }, [props.panel ? createVNode("div", mergeProps({
        "class": `${prefixCls}-date`
      }, divProps), [createVNode("div", {
        "class": `${prefixCls}-date-value`
      }, [t(`calendar.month.short.${col.name}`)])]) : createVNode("div", {
        "class": `${prefixCls}-month-with-days`
      }, [createVNode("div", {
        "class": `${prefixCls}-month-title`
      }, [t(`calendar.month.long.${col.name}`)]), createVNode(Month, {
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
export { Year as default };
