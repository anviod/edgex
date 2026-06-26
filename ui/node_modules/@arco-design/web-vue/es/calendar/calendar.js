import { defineComponent, toRefs, ref, computed, createVNode, mergeProps } from "vue";
import Month, { getAllDaysByTime } from "./month.js";
import Year from "./year.js";
import Header from "./header.js";
import { getDayjsValue, getNow, pickDataAttributes, methods } from "../_utils/date.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useI18n } from "../locale/index.js";
function getFormat(mode, panel) {
  return mode === "month" || mode === "year" && !panel ? "YYYY-MM-DD" : "YYYY-MM";
}
var _Calendar = defineComponent({
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
    "update:modelValue": (date) => true,
    "change": (date) => true,
    "panelChange": (date) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      dayStartOfWeek,
      isWeek
    } = toRefs(props);
    const prefixCls = getPrefixCls("calendar");
    const _mode = ref(props.defaultMode);
    const {
      t
    } = useI18n();
    const computedMode = computed(() => {
      if (props.mode) {
        return props.mode;
      }
      return _mode.value;
    });
    const format = getFormat(computedMode.value, props.panel);
    const _value = ref(getDayjsValue(props.defaultValue || Date.now(), format));
    const computedValue = computed(() => {
      if (props.modelValue) {
        return getDayjsValue(props.modelValue, format);
      }
      return _value.value;
    });
    const pageShowDate = ref(computedValue.value || getNow());
    const pageData = computed(() => {
      return getAllDaysByTime(pageShowDate.value, {
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
        pageShowDate.value = methods.subtract(pageShowDate.value, 1, unit);
      }
      if (type === "next") {
        pageShowDate.value = methods.add(pageShowDate.value, 1, unit);
      }
      emit("panelChange", pageShowDate.value.toDate());
    }
    function onChangeYear(year) {
      const newValue = methods.set(pageShowDate.value, "year", year);
      pageShowDate.value = newValue;
      emit("panelChange", newValue.toDate());
    }
    function onChangeMonth(month) {
      const newValue = methods.set(pageShowDate.value, "month", month - 1);
      pageShowDate.value = newValue;
      emit("panelChange", newValue.toDate());
    }
    function changeMode(mode) {
      _mode.value = mode;
    }
    const cls = computed(() => [prefixCls, computedMode.value === "month" ? `${prefixCls}-mode-month` : `${prefixCls}-mode-year`, {
      [`${prefixCls}-panel`]: props.panel && (computedMode.value === "month" || computedMode.value === "year")
    }]);
    const baseStyle = props.panel ? {
      width: props.panelWidth
    } : {};
    return () => createVNode("div", mergeProps({
      "class": cls.value,
      "style": baseStyle
    }, pickDataAttributes(props)), [createVNode(Header, {
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
    }), computedMode.value === "month" && createVNode("div", {
      "class": `${prefixCls}-body`
    }, [createVNode(Month, {
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
    })]), computedMode.value === "year" && createVNode("div", {
      "class": `${prefixCls}-body`
    }, [createVNode(Year, {
      "key": pageShowDate.value.year(),
      "pageData": pageData.value,
      "pageShowData": pageShowDate.value,
      "mode": computedMode.value,
      "isWeek": props.isWeek,
      "value": computedValue.value,
      "dayStartOfWeek": props.dayStartOfWeek,
      "selectHandler": selectHandler
    }, null)]), props.panel && props.panelTodayBtn && createVNode("div", {
      "class": `${prefixCls}-footer-btn-wrapper`
    }, [t("today")])]);
  }
});
export { _Calendar as default };
