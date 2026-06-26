"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var index = require("../../icon/icon-close/index.js");
var iconHover = require("../icon-hover.js");
var useFormItem = require("../../_hooks/use-form-item.js");
var useSize = require("../../_hooks/use-size.js");
var feedbackIcon = require("../feedback-icon.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "DateInput",
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
    const { error, focused, disabled, size, value, format, inputValue } = vue.toRefs(props);
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback
    } = useFormItem.useFormItem({ size, disabled, error });
    const { mergedSize } = useSize.useSize(_mergedSize);
    const prefixCls = globalConfig.getPrefixCls("picker");
    const classNames = vue.computed(() => [
      prefixCls,
      `${prefixCls}-size-${mergedSize.value}`,
      {
        [`${prefixCls}-focused`]: focused.value,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-error`]: mergedError.value,
        [`${prefixCls}-has-prefix`]: slots.prefix
      }
    ]);
    const displayValue = vue.computed(() => {
      if (inputValue == null ? void 0 : inputValue.value)
        return inputValue == null ? void 0 : inputValue.value;
      if ((value == null ? void 0 : value.value) && is.isDayjs(value.value)) {
        return is.isFunction(format.value) ? format.value(value.value) : value.value.format(format.value);
      }
      return void 0;
    });
    const refInput = vue.ref();
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
      class: vue.normalizeClass(`${_ctx.prefixCls}-input`)
    }, [
      vue.createElementVNode("input", vue.mergeProps({
        ref: "refInput",
        disabled: _ctx.mergedDisabled,
        placeholder: _ctx.placeholder,
        class: `${_ctx.prefixCls}-start-time`,
        value: _ctx.displayValue
      }, _ctx.readonly ? { readonly: true } : {}, {
        onKeydown: _cache[0] || (_cache[0] = vue.withKeys((...args) => _ctx.onPressEnter && _ctx.onPressEnter(...args), ["enter"])),
        onInput: _cache[1] || (_cache[1] = (...args) => _ctx.onChange && _ctx.onChange(...args)),
        onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.onBlur && _ctx.onBlur(...args))
      }), null, 16, _hoisted_1)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      _ctx.allowClear && !_ctx.mergedDisabled && _ctx.displayValue ? (vue.openBlock(), vue.createBlock(_component_IconHover, {
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
var DateInput = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DateInput;
