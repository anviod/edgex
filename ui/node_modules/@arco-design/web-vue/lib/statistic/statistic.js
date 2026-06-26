"use strict";
var vue = require("vue");
var originDayjs = require("dayjs");
var BTween = require("b-tween");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var originDayjs__default = /* @__PURE__ */ _interopDefaultLegacy(originDayjs);
var BTween__default = /* @__PURE__ */ _interopDefaultLegacy(BTween);
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("statistic");
    const numberValue = vue.computed(() => {
      if (is.isNumber(props.value)) {
        return props.value;
      }
      return 0;
    });
    const innerValue = vue.ref((_a = props.valueFrom) != null ? _a : props.value);
    const tween = vue.ref(null);
    const { value } = vue.toRefs(props);
    const showPlaceholder = vue.computed(() => is.isUndefined(props.value));
    const animation = (from = ((_b) => (_b = props.valueFrom) != null ? _b : 0)(), to = numberValue.value) => {
      var _a2;
      if (from !== to) {
        tween.value = new BTween__default["default"]({
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
    const formatValue = vue.computed(() => {
      let _value = innerValue.value;
      if (is.isNumber(_value)) {
        if (is.isNumber(props.precision)) {
          _value = NP__default["default"].round(_value, props.precision).toFixed(props.precision);
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
        _value = originDayjs__default["default"](_value).format(props.format);
      }
      return {
        isNumber: false,
        value: _value
      };
    });
    vue.onMounted(() => {
      if (props.animation && props.start) {
        animation();
      }
    });
    vue.watch(
      () => props.start,
      (value2) => {
        if (value2 && props.animation && !tween.value) {
          animation();
        }
      }
    );
    vue.watch(value, (value2) => {
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
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
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
      }, [
        _ctx.showPlaceholder ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1, vue.toDisplayString(_ctx.placeholder), 1)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
          _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-prefix`)
          }, [
            vue.renderSlot(_ctx.$slots, "prefix")
          ], 2)) : vue.createCommentVNode("v-if", true),
          _ctx.formatValue.isNumber ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(`${_ctx.prefixCls}-value-integer`)
            }, vue.toDisplayString(_ctx.formatValue.integer), 3),
            _ctx.formatValue.decimal ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(`${_ctx.prefixCls}-value-decimal`)
            }, " ." + vue.toDisplayString(_ctx.formatValue.decimal), 3)) : vue.createCommentVNode("v-if", true)
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
            vue.createTextVNode(vue.toDisplayString(_ctx.formatValue.value), 1)
          ], 64)),
          _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 3,
            class: vue.normalizeClass(`${_ctx.prefixCls}-suffix`)
          }, [
            vue.renderSlot(_ctx.$slots, "suffix")
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 64))
      ], 6),
      _ctx.extra || _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-extra`)
      }, [
        vue.renderSlot(_ctx.$slots, "extra", {}, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
        ])
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var _Statistic = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Statistic;
