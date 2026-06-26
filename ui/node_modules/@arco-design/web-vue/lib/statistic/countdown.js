"use strict";
var vue = require("vue");
var originDayjs = require("dayjs");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var originDayjs__default = /* @__PURE__ */ _interopDefaultLegacy(originDayjs);
const _sfc_main = vue.defineComponent({
  name: "Countdown",
  props: {
    title: String,
    value: {
      type: Number,
      default: () => Date.now() + 3e5
    },
    now: {
      type: Number,
      default: () => Date.now()
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    start: {
      type: Boolean,
      default: true
    },
    valueStyle: {
      type: Object
    }
  },
  emits: {
    finish: () => true
  },
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("statistic");
    const { start, value, now, format } = vue.toRefs(props);
    const displayValue = vue.ref(
      utils.getDateString(
        Math.max(originDayjs__default["default"](props.value).diff(originDayjs__default["default"](props.now), "millisecond"), 0),
        props.format
      )
    );
    vue.watch([value, now, format], () => {
      const _value = utils.getDateString(
        Math.max(originDayjs__default["default"](props.value).diff(originDayjs__default["default"](props.now), "millisecond"), 0),
        props.format
      );
      if (_value !== displayValue.value) {
        displayValue.value = _value;
      }
    });
    const timer = vue.ref(0);
    const stopTimer = () => {
      if (timer.value) {
        window.clearInterval(timer.value);
        timer.value = 0;
      }
    };
    const startTimer = () => {
      if (originDayjs__default["default"](props.value).valueOf() < Date.now()) {
        return;
      }
      timer.value = window.setInterval(() => {
        const _value = originDayjs__default["default"](props.value).diff(originDayjs__default["default"](), "millisecond");
        if (_value <= 0) {
          stopTimer();
          emit("finish");
        }
        displayValue.value = utils.getDateString(Math.max(_value, 0), props.format);
      }, 1e3 / 30);
    };
    vue.onMounted(() => {
      if (props.start) {
        startTimer();
      }
    });
    vue.onBeforeUnmount(() => {
      stopTimer();
    });
    vue.watch(start, (value2) => {
      if (value2 && !timer.value) {
        startTimer();
      }
    });
    return {
      prefixCls,
      displayValue
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass([`${_ctx.prefixCls}`, `${_ctx.prefixCls}-countdown`])
  }, [
    _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      vue.renderSlot(_ctx.$slots, "title", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-value`),
        style: vue.normalizeStyle(_ctx.valueStyle)
      }, vue.toDisplayString(_ctx.displayValue), 7)
    ], 2)
  ], 2);
}
var Countdown = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Countdown;
