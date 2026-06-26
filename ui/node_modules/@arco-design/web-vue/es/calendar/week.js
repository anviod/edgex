import { defineComponent, toRefs, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { useI18n } from "../locale/index.js";
var Week = defineComponent({
  name: "Week",
  props: {
    mode: {
      type: String
    },
    dayStartOfWeek: {
      type: Number
    },
    isWeek: {
      type: Boolean
    },
    panel: {
      type: Boolean
    },
    value: {
      type: Object,
      required: true
    },
    selectHandler: {
      type: Function
    },
    pageShowData: {
      type: Object,
      required: true
    },
    pageData: {
      type: Array
    }
  },
  setup(props) {
    const {
      dayStartOfWeek,
      isWeek,
      panel,
      mode
    } = toRefs(props);
    const prefixCls = getPrefixCls("calendar-week-list");
    const {
      t
    } = useI18n();
    const weekList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    if (dayStartOfWeek.value === 0) {
      weekList.unshift("sunday");
    } else {
      weekList.push("sunday");
    }
    if (isWeek.value) {
      weekList.unshift("self");
    }
    return () => createVNode("div", {
      "class": prefixCls
    }, [weekList.map((w) => createVNode("div", {
      "class": `${prefixCls}-item`,
      "key": w
    }, [t(`calendar.week.${panel.value || mode.value === "year" ? "short" : "long"}.${w}`)]))]);
  }
});
export { Week as default };
