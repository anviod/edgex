"use strict";
var vue = require("vue");
var month = require("./month.js");
var year = require("./year.js");
var header = require("./header.js");
var date = require("../_utils/date.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../locale/index.js");
function getFormat(mode, panel) {
  return mode === "month" || mode === "year" && !panel ? "YYYY-MM-DD" : "YYYY-MM";
}
var _Calendar = vue.defineComponent({
  name: "Calendar",
  props: {
    modelValue: {
      type: Date,
      default: void 0
    },
    defaultValue: {
      type: Date
    },
    mode: {
      type: String
    },
    defaultMode: {
      type: String,
      default: "month"
    },
    modes: {
      type: Array,
      default: () => ["month", "year"]
    },
    allowSelect: {
      type: Boolean,
      default: true
    },
    panel: {
      type: Boolean,
      default: false
    },
    panelWidth: {
      type: Number
    },
    panelTodayBtn: {
      type: Boolean,
      default: false
    },
    dayStartOfWeek: {
      type: Number,
      default: 0
    },
    isWeek: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (date2) => true,
    "change": (date2) => true,
    "panelChange": (date2) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      dayStartOfWeek,
      isWeek
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("calendar");
    const _mode = vue.ref(props.defaultMode);
    const {
      t
    } = index.useI18n();
    const computedMode = vue.computed(() => {
      if (props.mode) {
        return props.mode;
      }
      return _mode.value;
    });
    const format = getFormat(computedMode.value, props.panel);
    const _value = vue.ref(date.getDayjsValue(props.defaultValue || Date.now(), format));
    const computedValue = vue.computed(() => {
      if (props.modelValue) {
        return date.getDayjsValue(props.modelValue, format);
      }
      return _value.value;
    });
    const pageShowDate = vue.ref(computedValue.value || date.getNow());
    const pageData = vue.computed(() => {
      return month.getAllDaysByTime(pageShowDate.value, {
        dayStartOfWeek: dayStartOfWeek.value,
        isWeek: isWeek.value
      });
    });
    function onChangePageDate(time) {
      pageShowDate.value = time;
      emit("panelChange", time.toDate());
    }
    function move(time) {
      _value.value = time;
      emit("change", time.toDate());
      emit("update:modelValue", time.toDate());
      onChangePageDate(time);
    }
    function selectHandler(time, disabled = false) {
      if (!disabled) {
        move(time);
      }
    }
    let headerValueFormat = "";
    if (computedMode.value === "month") {
      headerValueFormat = t("calendar.formatMonth");
    } else if (computedMode.value === "year") {
      headerValueFormat = t("calendar.formatYear");
    }
    function changePageShowDate(type, unit) {
      if (type === "prev") {
        pageShowDate.value = date.methods.subtract(pageShowDate.value, 1, unit);
      }
      if (type === "next") {
        pageShowDate.value = date.methods.add(pageShowDate.value, 1, unit);
      }
      emit("panelChange", pageShowDate.value.toDate());
    }
    function onChangeYear(year2) {
      const newValue = date.methods.set(pageShowDate.value, "year", year2);
      pageShowDate.value = newValue;
      emit("panelChange", newValue.toDate());
    }
    function onChangeMonth(month2) {
      const newValue = date.methods.set(pageShowDate.value, "month", month2 - 1);
      pageShowDate.value = newValue;
      emit("panelChange", newValue.toDate());
    }
    function changeMode(mode) {
      _mode.value = mode;
    }
    const cls = vue.computed(() => [prefixCls, computedMode.value === "month" ? `${prefixCls}-mode-month` : `${prefixCls}-mode-year`, {
      [`${prefixCls}-panel`]: props.panel && (computedMode.value === "month" || computedMode.value === "year")
    }]);
    const baseStyle = props.panel ? {
      width: props.panelWidth
    } : {};
    return () => vue.createVNode("div", vue.mergeProps({
      "class": cls.value,
      "style": baseStyle
    }, date.pickDataAttributes(props)), [vue.createVNode(header, {
      "move": move,
      "headerValueFormat": headerValueFormat,
      "modes": props.modes,
      "mode": computedMode.value,
      "pageShowData": pageShowDate.value,
      "dayStartOfWeek": props.dayStartOfWeek,
      "isWeek": props.isWeek,
      "onModeChange": changeMode,
      "onYearChange": onChangeYear,
      "onMonthChange": onChangeMonth,
      "changePageShowDate": changePageShowDate
    }, {
      default: slots.header
    }), computedMode.value === "month" && vue.createVNode("div", {
      "class": `${prefixCls}-body`
    }, [vue.createVNode(month["default"], {
      "key": pageShowDate.value.month(),
      "pageData": pageData.value,
      "value": computedValue.value,
      "mode": computedMode.value,
      "selectHandler": selectHandler,
      "isWeek": props.isWeek,
      "dayStartOfWeek": props.dayStartOfWeek,
      "pageShowDate": pageShowDate.value
    }, {
      default: slots.default
    })]), computedMode.value === "year" && vue.createVNode("div", {
      "class": `${prefixCls}-body`
    }, [vue.createVNode(year, {
      "key": pageShowDate.value.year(),
      "pageData": pageData.value,
      "pageShowData": pageShowDate.value,
      "mode": computedMode.value,
      "isWeek": props.isWeek,
      "value": computedValue.value,
      "dayStartOfWeek": props.dayStartOfWeek,
      "selectHandler": selectHandler
    }, null)]), props.panel && props.panelTodayBtn && vue.createVNode("div", {
      "class": `${prefixCls}-footer-btn-wrapper`
    }, [t("today")])]);
  }
});
module.exports = _Calendar;
