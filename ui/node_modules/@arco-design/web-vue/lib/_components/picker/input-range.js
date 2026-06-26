"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var feedbackIcon = require("../feedback-icon.js");
var is = require("../../_utils/is.js");
var index = require("../../icon/icon-close/index.js");
var iconHover = require("../icon-hover.js");
var useFormItem = require("../../_hooks/use-form-item.js");
var useSize = require("../../_hooks/use-size.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "DateInputRange",
  components: {
    IconHover: iconHover,
    IconClose: index,
    FeedbackIcon: feedbackIcon
  },
  props: {
    size: {
      type: String
    },
    focused: {
      type: Boolean
    },
    focusedIndex: {
      type: Number
    },
    error: {
      type: Boolean
    },
    disabled: {
      type: [Boolean, Array],
      default: false
    },
    readonly: {
      type: Boolean
    },
    allowClear: {
      type: Boolean
    },
    placeholder: {
      type: Array,
      default: () => []
    },
    inputValue: {
      type: Array
    },
    value: {
      type: Array,
      default: () => []
    },
    format: {
      type: [String, Function],
      required: true
    }
  },
  emits: [
    "focused-index-change",
    "update:focusedIndex",
    "change",
    "clear",
    "press-enter"
  ],
  setup(props, { emit, slots }) {
    const {
      error,
      focused,
      disabled,
      size,
      value,
      format,
      focusedIndex,
      inputValue
    } = vue.toRefs(props);
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback
    } = useFormItem.useFormItem({ size, error });
    const { mergedSize } = useSize.useSize(_mergedSize);
    const refInput0 = vue.ref();
    const refInput1 = vue.ref();
    const getDisabled = (index2) => {
      if (mergedDisabled.value) {
        return mergedDisabled.value;
      }
      return is.isArray(disabled.value) ? disabled.value[index2] : disabled.value;
    };
    const disabled0 = vue.computed(() => getDisabled(0));
    const disabled1 = vue.computed(() => getDisabled(1));
    const prefixCls = globalConfig.getPrefixCls("picker");
    const classNames = vue.computed(() => [
      prefixCls,
      `${prefixCls}-range`,
      `${prefixCls}-size-${mergedSize.value}`,
      {
        [`${prefixCls}-focused`]: focused.value,
        [`${prefixCls}-disabled`]: disabled0.value && disabled1.value,
        [`${prefixCls}-error`]: mergedError.value,
        [`${prefixCls}-has-prefix`]: slots.prefix
      }
    ]);
    function getInputWrapClassName(index2) {
      return [
        `${prefixCls}-input`,
        {
          [`${prefixCls}-input-active`]: index2 === (focusedIndex == null ? void 0 : focusedIndex.value)
        }
      ];
    }
    function getDisplayValue(index2) {
      var _a, _b;
      if (inputValue == null ? void 0 : inputValue.value) {
        return (_a = inputValue == null ? void 0 : inputValue.value) == null ? void 0 : _a[index2];
      }
      const targetValue = (_b = value == null ? void 0 : value.value) == null ? void 0 : _b[index2];
      if (targetValue && is.isDayjs(targetValue)) {
        return is.isFunction(format.value) ? format.value(targetValue) : targetValue.format(format.value);
      }
      return void 0;
    }
    const displayValue0 = vue.computed(() => getDisplayValue(0));
    const displayValue1 = vue.computed(() => getDisplayValue(1));
    function changeFocusedInput(index2) {
      emit("focused-index-change", index2);
      emit("update:focusedIndex", index2);
    }
    function onChange(e) {
      e.stopPropagation();
      emit("change", e);
    }
    function onPressEnter() {
      emit("press-enter");
    }
    function onPressTab(e) {
      e.preventDefault();
    }
    function onClear(e) {
      emit("clear", e);
    }
    return {
      prefixCls,
      classNames,
      refInput0,
      refInput1,
      disabled0,
      disabled1,
      mergedDisabled,
      getDisabled,
      getInputWrapClassName,
      displayValue0,
      displayValue1,
      changeFocusedInput,
      onChange,
      onPressEnter,
      onPressTab,
      onClear,
      feedback
    };
  },
  methods: {
    focus(index2) {
      const targetIndex = is.isNumber(index2) ? index2 : this.focusedIndex;
      const targetElement = targetIndex === 0 ? this.refInput0 : this.refInput1;
      !is.isUndefined(targetIndex) && !this.getDisabled(targetIndex) && targetElement && targetElement.focus && targetElement.focus();
    },
    blur() {
      const targetElement = this.focusedIndex === 0 ? this.refInput0 : this.refInput1;
      targetElement && targetElement.blur && targetElement.blur();
    }
  }
});
const _hoisted_1 = ["disabled", "placeholder", "value"];
const _hoisted_2 = ["disabled", "placeholder", "value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconClose = vue.resolveComponent("IconClose");
  const _component_IconHover = vue.resolveComponent("IconHover");
  const _component_FeedbackIcon = vue.resolveComponent("FeedbackIcon");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-prefix`)
    }, [
      vue.renderSlot(_ctx.$slots, "prefix")
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getInputWrapClassName(0))
    }, [
      vue.createElementVNode("input", vue.mergeProps({
        ref: "refInput0",
        disabled: _ctx.disabled0,
        placeholder: _ctx.placeholder[0],
        value: _ctx.displayValue0
      }, _ctx.readonly ? { readonly: true } : {}, {
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onKeydown: [
          _cache[1] || (_cache[1] = vue.withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
          _cache[2] || (_cache[2] = vue.withKeys((...args) => _ctx.onPressTab && _ctx.onPressTab(...args), ["tab"]))
        ],
        onClick: _cache[3] || (_cache[3] = () => _ctx.changeFocusedInput(0))
      }), null, 16, _hoisted_1)
    ], 2),
    vue.createElementVNode("span", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-separator`)
    }, [
      vue.renderSlot(_ctx.$slots, "separator", {}, () => [
        _cache[8] || (_cache[8] = vue.createTextVNode(" - "))
      ])
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(_ctx.getInputWrapClassName(1))
    }, [
      vue.createElementVNode("input", vue.mergeProps({
        ref: "refInput1",
        disabled: _ctx.disabled1,
        placeholder: _ctx.placeholder[1],
        value: _ctx.displayValue1
      }, _ctx.readonly ? { readonly: true } : {}, {
        onInput: _cache[4] || (_cache[4] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onKeydown: [
          _cache[5] || (_cache[5] = vue.withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
          _cache[6] || (_cache[6] = vue.withKeys((...args) => _ctx.onPressTab && _ctx.onPressTab(...args), ["tab"]))
        ],
        onClick: _cache[7] || (_cache[7] = () => _ctx.changeFocusedInput(1))
      }), null, 16, _hoisted_2)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      _ctx.allowClear && !_ctx.mergedDisabled && _ctx.value.length === 2 ? (vue.openBlock(), vue.createBlock(_component_IconHover, {
        key: 0,
        prefix: _ctx.prefixCls,
        class: vue.normalizeClass(`${_ctx.prefixCls}-clear-icon`),
        onClick: _ctx.onClear
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_IconClose)
        ]),
        _: 1
      }, 8, ["prefix", "class", "onClick"])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("span", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-suffix-icon`)
      }, [
        vue.renderSlot(_ctx.$slots, "suffix-icon")
      ], 2),
      _ctx.feedback ? (vue.openBlock(), vue.createBlock(_component_FeedbackIcon, {
        key: 1,
        type: _ctx.feedback
      }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var DateRangeInput = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DateRangeInput;
