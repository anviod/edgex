import { defineComponent, toRefs, ref, watch, onMounted, onBeforeUnmount, openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, normalizeStyle } from "vue";
import originDayjs from "dayjs";
import { getPrefixCls } from "../_utils/global-config.js";
import { getDateString } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    const prefixCls = getPrefixCls("statistic");
    const { start, value, now, format } = toRefs(props);
    const displayValue = ref(
      getDateString(
        Math.max(originDayjs(props.value).diff(originDayjs(props.now), "millisecond"), 0),
        props.format
      )
    );
    watch([value, now, format], () => {
      const _value = getDateString(
        Math.max(originDayjs(props.value).diff(originDayjs(props.now), "millisecond"), 0),
        props.format
      );
      if (_value !== displayValue.value) {
        displayValue.value = _value;
      }
    });
    const timer = ref(0);
    const stopTimer = () => {
      if (timer.value) {
        window.clearInterval(timer.value);
        timer.value = 0;
      }
    };
    const startTimer = () => {
      if (originDayjs(props.value).valueOf() < Date.now()) {
        return;
      }
      timer.value = window.setInterval(() => {
        const _value = originDayjs(props.value).diff(originDayjs(), "millisecond");
        if (_value <= 0) {
          stopTimer();
          emit("finish");
        }
        displayValue.value = getDateString(Math.max(_value, 0), props.format);
      }, 1e3 / 30);
    };
    onMounted(() => {
      if (props.start) {
        startTimer();
      }
    });
    onBeforeUnmount(() => {
      stopTimer();
    });
    watch(start, (value2) => {
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
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([`${_ctx.prefixCls}`, `${_ctx.prefixCls}-countdown`])
  }, [
    _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-value`),
        style: normalizeStyle(_ctx.valueStyle)
      }, toDisplayString(_ctx.displayValue), 7)
    ], 2)
  ], 2);
}
var Countdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Countdown as default };
