import { defineComponent, toRefs, ref, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, mergeProps, withKeys, createTextVNode, createBlock, withCtx, createVNode } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import FeedbackIcon from "../feedback-icon.js";
import { isNumber, isUndefined, isArray, isDayjs, isFunction } from "../../_utils/is.js";
import IconClose from "../../icon/icon-close/index.js";
import IconHover from "../icon-hover.js";
import { useFormItem } from "../../_hooks/use-form-item.js";
import { useSize } from "../../_hooks/use-size.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "DateInputRange",
  components: {
    IconHover,
    IconClose,
    FeedbackIcon
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
    } = toRefs(props);
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback
    } = useFormItem({ size, error });
    const { mergedSize } = useSize(_mergedSize);
    const refInput0 = ref();
    const refInput1 = ref();
    const getDisabled = (index) => {
      if (mergedDisabled.value) {
        return mergedDisabled.value;
      }
      return isArray(disabled.value) ? disabled.value[index] : disabled.value;
    };
    const disabled0 = computed(() => getDisabled(0));
    const disabled1 = computed(() => getDisabled(1));
    const prefixCls = getPrefixCls("picker");
    const classNames = computed(() => [
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
    function getInputWrapClassName(index) {
      return [
        `${prefixCls}-input`,
        {
          [`${prefixCls}-input-active`]: index === (focusedIndex == null ? void 0 : focusedIndex.value)
        }
      ];
    }
    function getDisplayValue(index) {
      var _a, _b;
      if (inputValue == null ? void 0 : inputValue.value) {
        return (_a = inputValue == null ? void 0 : inputValue.value) == null ? void 0 : _a[index];
      }
      const targetValue = (_b = value == null ? void 0 : value.value) == null ? void 0 : _b[index];
      if (targetValue && isDayjs(targetValue)) {
        return isFunction(format.value) ? format.value(targetValue) : targetValue.format(format.value);
      }
      return void 0;
    }
    const displayValue0 = computed(() => getDisplayValue(0));
    const displayValue1 = computed(() => getDisplayValue(1));
    function changeFocusedInput(index) {
      emit("focused-index-change", index);
      emit("update:focusedIndex", index);
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
    focus(index) {
      const targetIndex = isNumber(index) ? index : this.focusedIndex;
      const targetElement = targetIndex === 0 ? this.refInput0 : this.refInput1;
      !isUndefined(targetIndex) && !this.getDisabled(targetIndex) && targetElement && targetElement.focus && targetElement.focus();
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
  const _component_IconClose = resolveComponent("IconClose");
  const _component_IconHover = resolveComponent("IconHover");
  const _component_FeedbackIcon = resolveComponent("FeedbackIcon");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    _ctx.$slots.prefix ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-prefix`)
    }, [
      renderSlot(_ctx.$slots, "prefix")
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(_ctx.getInputWrapClassName(0))
    }, [
      createElementVNode("input", mergeProps({
        ref: "refInput0",
        disabled: _ctx.disabled0,
        placeholder: _ctx.placeholder[0],
        value: _ctx.displayValue0
      }, _ctx.readonly ? { readonly: true } : {}, {
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onKeydown: [
          _cache[1] || (_cache[1] = withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
          _cache[2] || (_cache[2] = withKeys((...args) => _ctx.onPressTab && _ctx.onPressTab(...args), ["tab"]))
        ],
        onClick: _cache[3] || (_cache[3] = () => _ctx.changeFocusedInput(0))
      }), null, 16, _hoisted_1)
    ], 2),
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-separator`)
    }, [
      renderSlot(_ctx.$slots, "separator", {}, () => [
        _cache[8] || (_cache[8] = createTextVNode(" - "))
      ])
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(_ctx.getInputWrapClassName(1))
    }, [
      createElementVNode("input", mergeProps({
        ref: "refInput1",
        disabled: _ctx.disabled1,
        placeholder: _ctx.placeholder[1],
        value: _ctx.displayValue1
      }, _ctx.readonly ? { readonly: true } : {}, {
        onInput: _cache[4] || (_cache[4] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onKeydown: [
          _cache[5] || (_cache[5] = withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
          _cache[6] || (_cache[6] = withKeys((...args) => _ctx.onPressTab && _ctx.onPressTab(...args), ["tab"]))
        ],
        onClick: _cache[7] || (_cache[7] = () => _ctx.changeFocusedInput(1))
      }), null, 16, _hoisted_2)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      _ctx.allowClear && !_ctx.mergedDisabled && _ctx.value.length === 2 ? (openBlock(), createBlock(_component_IconHover, {
        key: 0,
        prefix: _ctx.prefixCls,
        class: normalizeClass(`${_ctx.prefixCls}-clear-icon`),
        onClick: _ctx.onClear
      }, {
        default: withCtx(() => [
          createVNode(_component_IconClose)
        ]),
        _: 1
      }, 8, ["prefix", "class", "onClick"])) : createCommentVNode("v-if", true),
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-suffix-icon`)
      }, [
        renderSlot(_ctx.$slots, "suffix-icon")
      ], 2),
      _ctx.feedback ? (openBlock(), createBlock(_component_FeedbackIcon, {
        key: 1,
        type: _ctx.feedback
      }, null, 8, ["type"])) : createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var DateRangeInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DateRangeInput as default };
