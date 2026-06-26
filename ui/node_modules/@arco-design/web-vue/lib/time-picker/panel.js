"use strict";
var vue = require("vue");
var timeColumn = require("./time-column.js");
var index = require("../button/index.js");
var is = require("../_utils/is.js");
var date = require("../_utils/date.js");
var globalConfig = require("../_utils/global-config.js");
var useTimeList = require("./hooks/use-time-list.js");
var useTimeFormat = require("./hooks/use-time-format.js");
var useIsDisabledTime = require("./hooks/use-is-disabled-time.js");
var index$1 = require("../locale/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TimePickerPanel",
  components: {
    TimeColumn: timeColumn,
    Button: index["default"]
  },
  props: {
    value: {
      type: Object
    },
    visible: {
      type: Boolean
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    use12Hours: {
      type: Boolean
    },
    step: {
      type: Object
    },
    disabledHours: {
      type: Function
    },
    disabledMinutes: {
      type: Function
    },
    disabledSeconds: {
      type: Function
    },
    hideDisabledOptions: {
      type: Boolean
    },
    hideFooter: {
      type: Boolean
    },
    isRange: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  emits: {
    select: (value) => is.isDayjs(value),
    confirm: (value) => is.isDayjs(value)
  },
  setup(props, { emit }) {
    const {
      value,
      visible,
      format,
      step,
      use12Hours,
      hideDisabledOptions,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      disabled
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("timepicker");
    const { t } = index$1.useI18n();
    const {
      columns,
      use12Hours: computedUse12Hours,
      format: computedFormat
    } = useTimeFormat(
      vue.reactive({
        format,
        use12Hours
      })
    );
    const selectedValue = vue.ref(value == null ? void 0 : value.value);
    const setSelectedValue = (value2) => {
      selectedValue.value = value2;
    };
    vue.watch([visible, value], () => {
      if (!visible.value)
        return;
      setSelectedValue(value == null ? void 0 : value.value);
    });
    const selectedHour = vue.computed(() => {
      var _a;
      const _hour = (_a = selectedValue.value) == null ? void 0 : _a.hour();
      if (is.isUndefined(_hour) || !computedUse12Hours.value)
        return _hour;
      if (_hour > 12)
        return _hour - 12;
      if (_hour === 0)
        return 12;
      return _hour;
    });
    const selectedMinute = vue.computed(() => {
      var _a;
      return (_a = selectedValue.value) == null ? void 0 : _a.minute();
    });
    const selectedSecond = vue.computed(() => {
      var _a;
      return (_a = selectedValue.value) == null ? void 0 : _a.second();
    });
    const selectedAmpm = vue.computed(() => {
      var _a;
      const _hour = (_a = selectedValue.value) == null ? void 0 : _a.hour();
      return !is.isUndefined(_hour) && _hour >= 12 ? "pm" : "am";
    });
    const { hours, minutes, seconds, ampmList } = useTimeList(
      vue.reactive({
        format: computedFormat,
        step,
        use12Hours: computedUse12Hours,
        hideDisabledOptions,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        selectedHour,
        selectedMinute,
        selectedSecond,
        selectedAmpm,
        disabled
      })
    );
    const isDisabledTime = useIsDisabledTime(
      vue.reactive({
        disabledHours,
        disabledMinutes,
        disabledSeconds
      })
    );
    const confirmBtnDisabled = vue.computed(
      () => isDisabledTime(selectedValue.value)
    );
    function emitConfirm(value2) {
      if (is.isUndefined(value2))
        return;
      emit("confirm", value2);
    }
    function emitSelect(value2) {
      setSelectedValue(value2);
      emit("select", value2);
    }
    function onSelect(value2, type = "hour") {
      let newValue;
      const hour = selectedHour.value || "00";
      const minute = selectedMinute.value || "00";
      const second = selectedSecond.value || "00";
      const ampm = selectedAmpm.value || "am";
      switch (type) {
        case "hour":
          newValue = `${value2}:${minute}:${second}`;
          break;
        case "minute":
          newValue = `${hour}:${value2}:${second}`;
          break;
        case "second":
          newValue = `${hour}:${minute}:${value2}`;
          break;
        case "ampm":
          newValue = `${hour}:${minute}:${second} ${value2}`;
          break;
        default:
          newValue = "00:00:00";
      }
      let valueFormat = "HH:mm:ss";
      if (computedUse12Hours.value) {
        valueFormat = "HH:mm:ss a";
        if (type !== "ampm") {
          newValue = `${newValue} ${ampm}`;
        }
      }
      newValue = date.dayjs(newValue, valueFormat);
      emitSelect(newValue);
    }
    return {
      prefixCls,
      t,
      hours,
      minutes,
      seconds,
      ampmList,
      selectedValue,
      selectedHour,
      selectedMinute,
      selectedSecond,
      selectedAmpm,
      computedUse12Hours,
      confirmBtnDisabled,
      columns,
      onSelect,
      onSelectNow() {
        const newValue = date.dayjs(new Date());
        emitSelect(newValue);
      },
      onConfirm() {
        emitConfirm(selectedValue.value);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TimeColumn = vue.resolveComponent("TimeColumn");
  const _component_Button = vue.resolveComponent("Button");
  return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.prefixCls)
    }, [
      _ctx.columns.includes("H") || _ctx.columns.includes("h") ? (vue.openBlock(), vue.createBlock(_component_TimeColumn, {
        key: 0,
        value: _ctx.selectedHour,
        list: _ctx.hours,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[0] || (_cache[0] = (value) => {
          _ctx.onSelect(value, "hour");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : vue.createCommentVNode("v-if", true),
      _ctx.columns.includes("m") ? (vue.openBlock(), vue.createBlock(_component_TimeColumn, {
        key: 1,
        value: _ctx.selectedMinute,
        list: _ctx.minutes,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[1] || (_cache[1] = (value) => {
          _ctx.onSelect(value, "minute");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : vue.createCommentVNode("v-if", true),
      _ctx.columns.includes("s") ? (vue.openBlock(), vue.createBlock(_component_TimeColumn, {
        key: 2,
        value: _ctx.selectedSecond,
        list: _ctx.seconds,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[2] || (_cache[2] = (value) => {
          _ctx.onSelect(value, "second");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : vue.createCommentVNode("v-if", true),
      _ctx.computedUse12Hours ? (vue.openBlock(), vue.createBlock(_component_TimeColumn, {
        key: 3,
        value: _ctx.selectedAmpm,
        list: _ctx.ampmList,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[3] || (_cache[3] = (value) => {
          _ctx.onSelect(value, "ampm");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : vue.createCommentVNode("v-if", true)
    ], 2),
    _ctx.$slots["extra-footer"] ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer-extra-wrapper`)
    }, [
      vue.renderSlot(_ctx.$slots, "extra-footer")
    ], 2)) : vue.createCommentVNode("v-if", true),
    !_ctx.hideFooter ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer-btn-wrapper`)
    }, [
      !_ctx.isRange ? (vue.openBlock(), vue.createBlock(_component_Button, {
        key: 0,
        size: "mini",
        onClick: _ctx.onSelectNow
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(_ctx.t("datePicker.now")), 1)
        ]),
        _: 1
      }, 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_Button, {
        type: "primary",
        size: "mini",
        disabled: _ctx.confirmBtnDisabled || !_ctx.selectedValue,
        onClick: _ctx.onConfirm
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(_ctx.t("datePicker.ok")), 1)
        ]),
        _: 1
      }, 8, ["disabled", "onClick"])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 64);
}
var Panel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Panel;
