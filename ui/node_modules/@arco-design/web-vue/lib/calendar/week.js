"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../locale/index.js");
var Week = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("calendar-week-list");
    const {
      t
    } = index.useI18n();
    const weekList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    if (dayStartOfWeek.value === 0) {
      weekList.unshift("sunday");
    } else {
      weekList.push("sunday");
    }
    if (isWeek.value) {
      weekList.unshift("self");
    }
    return () => vue.createVNode("div", {
      "class": prefixCls
    }, [weekList.map((w) => vue.createVNode("div", {
      "class": `${prefixCls}-item`,
      "key": w
    }, [t(`calendar.week.${panel.value || mode.value === "year" ? "short" : "long"}.${w}`)]))]);
  }
});
module.exports = Week;
