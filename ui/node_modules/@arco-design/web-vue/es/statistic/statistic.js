import { defineComponent, computed, ref, toRefs, onMounted, watch, openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createElementVNode, normalizeStyle, Fragment } from "vue";
import originDayjs from "dayjs";
import BTween from "b-tween";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber, isUndefined } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Statistic",
  props: {
    title: String,
    value: {
      type: [Number, Object]
    },
    format: {
      type: String,
      default: "HH:mm:ss"
    },
    extra: String,
    start: {
      type: Boolean,
      default: true
    },
    precision: {
      type: Number,
      default: 0
    },
    separator: String,
    showGroupSeparator: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      default: false
    },
    animationDuration: {
      type: Number,
      default: 2e3
    },
    valueFrom: {
      type: Number,
      default: void 0
    },
    placeholder: {
      type: String
    },
    valueStyle: {
      type: Object
    }
  },
  setup(props) {
    var _a;
    const prefixCls = getPrefixCls("statistic");
    const numberValue = computed(() => {
      if (isNumber(props.value)) {
        return props.value;
      }
      return 0;
    });
    const innerValue = ref((_a = props.valueFrom) != null ? _a : props.value);
    const tween = ref(null);
    const { value } = toRefs(props);
    const showPlaceholder = computed(() => isUndefined(props.value));
    const animation = (from = ((_b) => (_b = props.valueFrom) != null ? _b : 0)(), to = numberValue.value) => {
      var _a2;
      if (from !== to) {
        tween.value = new BTween({
          from: {
            value: from
          },
          to: {
            value: to
          },
          duration: props.animationDuration,
          easing: "quartOut",
          onUpdate: (keys) => {
            innerValue.value = keys.value;
          },
          onFinish: () => {
            innerValue.value = to;
          }
        });
        (_a2 = tween.value) == null ? void 0 : _a2.start();
      }
    };
    const formatValue = computed(() => {
      let _value = innerValue.value;
      if (isNumber(_value)) {
        if (isNumber(props.precision)) {
          _value = NP.round(_value, props.precision).toFixed(props.precision);
        }
        const splitValue = String(_value).split(".");
        const integer = props.showGroupSeparator ? Number(splitValue[0]).toLocaleString("en-US") : splitValue[0];
        const decimal = splitValue[1];
        return {
          isNumber: true,
          integer,
          decimal
        };
      }
      if (props.format) {
        _value = originDayjs(_value).format(props.format);
      }
      return {
        isNumber: false,
        value: _value
      };
    });
    onMounted(() => {
      if (props.animation && props.start) {
        animation();
      }
    });
    watch(
      () => props.start,
      (value2) => {
        if (value2 && props.animation && !tween.value) {
          animation();
        }
      }
    );
    watch(value, (value2) => {
      var _a2;
      if (tween.value) {
        (_a2 = tween.value) == null ? void 0 : _a2.stop();
        tween.value = null;
      }
      innerValue.value = value2;
      if (props.animation && props.start) {
        animation();
      }
    });
    return {
      prefixCls,
      showPlaceholder,
      formatValue
    };
  }
});
const _hoisted_1 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
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
      }, [
        _ctx.showPlaceholder ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(_ctx.placeholder), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          _ctx.$slots.prefix ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-prefix`)
          }, [
            renderSlot(_ctx.$slots, "prefix")
          ], 2)) : createCommentVNode("v-if", true),
          _ctx.formatValue.isNumber ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
            createElementVNode("span", {
              class: normalizeClass(`${_ctx.prefixCls}-value-integer`)
            }, toDisplayString(_ctx.formatValue.integer), 3),
            _ctx.formatValue.decimal ? (openBlock(), createElementBlock("span", {
              key: 0,
              class: normalizeClass(`${_ctx.prefixCls}-value-decimal`)
            }, " ." + toDisplayString(_ctx.formatValue.decimal), 3)) : createCommentVNode("v-if", true)
          ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 2 }, [
            createTextVNode(toDisplayString(_ctx.formatValue.value), 1)
          ], 64)),
          _ctx.$slots.suffix ? (openBlock(), createElementBlock("span", {
            key: 3,
            class: normalizeClass(`${_ctx.prefixCls}-suffix`)
          }, [
            renderSlot(_ctx.$slots, "suffix")
          ], 2)) : createCommentVNode("v-if", true)
        ], 64))
      ], 6),
      _ctx.extra || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-extra`)
      }, [
        renderSlot(_ctx.$slots, "extra", {}, () => [
          createTextVNode(toDisplayString(_ctx.extra), 1)
        ])
      ], 2)) : createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var _Statistic = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Statistic as default };
