import { defineComponent, toRefs, computed, ref, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, mergeProps, withKeys, createBlock, withCtx, createVNode } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isDayjs, isFunction } from "../../_utils/is.js";
import IconClose from "../../icon/icon-close/index.js";
import IconHover from "../icon-hover.js";
import { useFormItem } from "../../_hooks/use-form-item.js";
import { useSize } from "../../_hooks/use-size.js";
import FeedbackIcon from "../feedback-icon.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "DateInput",
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
    disabled: {
      type: Boolean
    },
    readonly: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    allowClear: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    inputValue: {
      type: String
    },
    value: {
      type: Object
    },
    format: {
      type: [String, Function],
      required: true
    }
  },
  emits: ["clear", "press-enter", "change", "blur"],
  setup(props, { emit, slots }) {
    const { error, focused, disabled, size, value, format, inputValue } = toRefs(props);
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback
    } = useFormItem({ size, disabled, error });
    const { mergedSize } = useSize(_mergedSize);
    const prefixCls = getPrefixCls("picker");
    const classNames = computed(() => [
      prefixCls,
      `${prefixCls}-size-${mergedSize.value}`,
      {
        [`${prefixCls}-focused`]: focused.value,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-error`]: mergedError.value,
        [`${prefixCls}-has-prefix`]: slots.prefix
      }
    ]);
    const displayValue = computed(() => {
      if (inputValue == null ? void 0 : inputValue.value)
        return inputValue == null ? void 0 : inputValue.value;
      if ((value == null ? void 0 : value.value) && isDayjs(value.value)) {
        return isFunction(format.value) ? format.value(value.value) : value.value.format(format.value);
      }
      return void 0;
    });
    const refInput = ref();
    return {
      feedback,
      prefixCls,
      classNames,
      displayValue,
      mergedDisabled,
      refInput,
      onPressEnter() {
        emit("press-enter");
      },
      onChange(e) {
        emit("change", e);
      },
      onClear(e) {
        emit("clear", e);
      },
      onBlur(e) {
        emit("blur", e);
      }
    };
  },
  methods: {
    focus() {
      this.refInput && this.refInput.focus && this.refInput.focus();
    },
    blur() {
      this.refInput && this.refInput.blur && this.refInput.blur();
    }
  }
});
const _hoisted_1 = ["disabled", "placeholder", "value"];
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
      class: normalizeClass(`${_ctx.prefixCls}-input`)
    }, [
      createElementVNode("input", mergeProps({
        ref: "refInput",
        disabled: _ctx.mergedDisabled,
        placeholder: _ctx.placeholder,
        class: `${_ctx.prefixCls}-start-time`,
        value: _ctx.displayValue
      }, _ctx.readonly ? { readonly: true } : {}, {
        onKeydown: _cache[0] || (_cache[0] = withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
        onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.onBlur && _ctx.onBlur(...args))
      }), null, 16, _hoisted_1)
    ], 2),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      _ctx.allowClear && !_ctx.mergedDisabled && _ctx.displayValue ? (openBlock(), createBlock(_component_IconHover, {
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
var DateInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DateInput as default };
