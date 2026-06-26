import { defineComponent, toRefs, reactive, ref, watch, computed, resolveComponent, openBlock, createElementBlock, Fragment, createElementVNode, normalizeClass, createBlock, createCommentVNode, renderSlot, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import TimeColumn from "./time-column.js";
import Button from "../button/index.js";
import { isDayjs, isUndefined } from "../_utils/is.js";
import { dayjs } from "../_utils/date.js";
import { getPrefixCls } from "../_utils/global-config.js";
import useTimeList from "./hooks/use-time-list.js";
import useTimeFormat from "./hooks/use-time-format.js";
import useIsDisabledTime from "./hooks/use-is-disabled-time.js";
import { useI18n } from "../locale/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TimePickerPanel",
  components: {
    TimeColumn,
    Button
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
    select: (value) => isDayjs(value),
    confirm: (value) => isDayjs(value)
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
    } = toRefs(props);
    const prefixCls = getPrefixCls("timepicker");
    const { t } = useI18n();
    const {
      columns,
      use12Hours: computedUse12Hours,
      format: computedFormat
    } = useTimeFormat(
      reactive({
        format,
        use12Hours
      })
    );
    const selectedValue = ref(value == null ? void 0 : value.value);
    const setSelectedValue = (value2) => {
      selectedValue.value = value2;
    };
    watch([visible, value], () => {
      if (!visible.value)
        return;
      setSelectedValue(value == null ? void 0 : value.value);
    });
    const selectedHour = computed(() => {
      var _a;
      const _hour = (_a = selectedValue.value) == null ? void 0 : _a.hour();
      if (isUndefined(_hour) || !computedUse12Hours.value)
        return _hour;
      if (_hour > 12)
        return _hour - 12;
      if (_hour === 0)
        return 12;
      return _hour;
    });
    const selectedMinute = computed(() => {
      var _a;
      return (_a = selectedValue.value) == null ? void 0 : _a.minute();
    });
    const selectedSecond = computed(() => {
      var _a;
      return (_a = selectedValue.value) == null ? void 0 : _a.second();
    });
    const selectedAmpm = computed(() => {
      var _a;
      const _hour = (_a = selectedValue.value) == null ? void 0 : _a.hour();
      return !isUndefined(_hour) && _hour >= 12 ? "pm" : "am";
    });
    const { hours, minutes, seconds, ampmList } = useTimeList(
      reactive({
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
      reactive({
        disabledHours,
        disabledMinutes,
        disabledSeconds
      })
    );
    const confirmBtnDisabled = computed(
      () => isDisabledTime(selectedValue.value)
    );
    function emitConfirm(value2) {
      if (isUndefined(value2))
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
      newValue = dayjs(newValue, valueFormat);
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
        const newValue = dayjs(new Date());
        emitSelect(newValue);
      },
      onConfirm() {
        emitConfirm(selectedValue.value);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TimeColumn = resolveComponent("TimeColumn");
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("div", {
      class: normalizeClass(_ctx.prefixCls)
    }, [
      _ctx.columns.includes("H") || _ctx.columns.includes("h") ? (openBlock(), createBlock(_component_TimeColumn, {
        key: 0,
        value: _ctx.selectedHour,
        list: _ctx.hours,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[0] || (_cache[0] = (value) => {
          _ctx.onSelect(value, "hour");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : createCommentVNode("v-if", true),
      _ctx.columns.includes("m") ? (openBlock(), createBlock(_component_TimeColumn, {
        key: 1,
        value: _ctx.selectedMinute,
        list: _ctx.minutes,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[1] || (_cache[1] = (value) => {
          _ctx.onSelect(value, "minute");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : createCommentVNode("v-if", true),
      _ctx.columns.includes("s") ? (openBlock(), createBlock(_component_TimeColumn, {
        key: 2,
        value: _ctx.selectedSecond,
        list: _ctx.seconds,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[2] || (_cache[2] = (value) => {
          _ctx.onSelect(value, "second");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : createCommentVNode("v-if", true),
      _ctx.computedUse12Hours ? (openBlock(), createBlock(_component_TimeColumn, {
        key: 3,
        value: _ctx.selectedAmpm,
        list: _ctx.ampmList,
        "prefix-cls": _ctx.prefixCls,
        visible: _ctx.visible,
        onSelect: _cache[3] || (_cache[3] = (value) => {
          _ctx.onSelect(value, "ampm");
        })
      }, null, 8, ["value", "list", "prefix-cls", "visible"])) : createCommentVNode("v-if", true)
    ], 2),
    _ctx.$slots["extra-footer"] ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-footer-extra-wrapper`)
    }, [
      renderSlot(_ctx.$slots, "extra-footer")
    ], 2)) : createCommentVNode("v-if", true),
    !_ctx.hideFooter ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-footer-btn-wrapper`)
    }, [
      !_ctx.isRange ? (openBlock(), createBlock(_component_Button, {
        key: 0,
        size: "mini",
        onClick: _ctx.onSelectNow
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.t("datePicker.now")), 1)
        ]),
        _: 1
      }, 8, ["onClick"])) : createCommentVNode("v-if", true),
      createVNode(_component_Button, {
        type: "primary",
        size: "mini",
        disabled: _ctx.confirmBtnDisabled || !_ctx.selectedValue,
        onClick: _ctx.onConfirm
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.t("datePicker.ok")), 1)
        ]),
        _: 1
      }, 8, ["disabled", "onClick"])
    ], 2)) : createCommentVNode("v-if", true)
  ], 64);
}
var Panel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Panel as default };
