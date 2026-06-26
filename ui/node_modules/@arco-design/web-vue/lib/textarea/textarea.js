"use strict";
var vue = require("vue");
var resizeObserver = require("../_components/resize-observer.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-close/index.js");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var is = require("../_utils/is.js");
var omit = require("../_utils/omit.js");
var constant = require("../_utils/constant.js");
var pick = require("../_utils/pick.js");
var useFormItem = require("../_hooks/use-form-item.js");
var useCursor = require("../_hooks/use-cursor.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Textarea",
  components: { ResizeObserver: resizeObserver, IconHover: iconHover, IconClose: index },
  inheritAttrs: false,
  props: {
    modelValue: String,
    defaultValue: {
      type: String,
      default: ""
    },
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: [Number, Object],
      default: 0
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    autoSize: {
      type: [Boolean, Object],
      default: false
    },
    wordLength: {
      type: Function
    },
    wordSlice: {
      type: Function
    },
    textareaAttrs: {
      type: Object
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "input": (value, ev) => true,
    "change": (value, ev) => true,
    "clear": (ev) => true,
    "focus": (ev) => true,
    "blur": (ev) => true
  },
  setup(props, { emit, attrs }) {
    const { disabled, error, modelValue } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("textarea");
    const {
      mergedDisabled,
      mergedError: _mergedError,
      eventHandlers
    } = useFormItem.useFormItem({ disabled, error });
    const textareaRef = vue.ref();
    const textareaStyle = vue.ref();
    const mirrorRef = vue.ref();
    const mirrorStyle = vue.ref();
    const _value = vue.ref(props.defaultValue);
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = modelValue.value) != null ? _a : _value.value;
    });
    const [recordCursor, setCursor] = useCursor.useCursor(textareaRef);
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = "";
      }
    });
    const maxLengthErrorOnly = vue.computed(
      () => is.isObject(props.maxLength) && Boolean(props.maxLength.errorOnly)
    );
    const computedMaxLength = vue.computed(() => {
      if (is.isObject(props.maxLength)) {
        return props.maxLength.length;
      }
      return props.maxLength;
    });
    const getValueLength = (value) => {
      var _a;
      if (is.isFunction(props.wordLength)) {
        return props.wordLength(value);
      }
      return (_a = value.length) != null ? _a : 0;
    };
    const valueLength = vue.computed(() => getValueLength(computedValue.value));
    const mergedError = vue.computed(
      () => _mergedError.value || Boolean(
        computedMaxLength.value && maxLengthErrorOnly.value && valueLength.value > computedMaxLength.value
      )
    );
    const isScroll = vue.ref(false);
    const focused = vue.ref(false);
    const showClearBtn = vue.computed(
      () => props.allowClear && !mergedDisabled.value && computedValue.value
    );
    const isComposition = vue.ref(false);
    const compositionValue = vue.ref("");
    const keepControl = () => {
      recordCursor();
      vue.nextTick(() => {
        if (textareaRef.value && computedValue.value !== textareaRef.value.value) {
          textareaRef.value.value = computedValue.value;
          setCursor();
        }
      });
    };
    const updateValue = (value, inner = true) => {
      var _a, _b;
      if (computedMaxLength.value && !maxLengthErrorOnly.value && getValueLength(value) > computedMaxLength.value) {
        value = (_b = (_a = props.wordSlice) == null ? void 0 : _a.call(props, value, computedMaxLength.value)) != null ? _b : value.slice(0, computedMaxLength.value);
      }
      _value.value = value;
      if (inner) {
        emit("update:modelValue", value);
      }
      keepControl();
    };
    let preValue = computedValue.value;
    const emitChange = (value, ev) => {
      var _a, _b;
      if (value !== preValue) {
        preValue = value;
        emit("change", value, ev);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a, ev);
      }
    };
    const handleFocus = (ev) => {
      var _a, _b;
      focused.value = true;
      preValue = computedValue.value;
      emit("focus", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      focused.value = false;
      emit("blur", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
      emitChange(computedValue.value, ev);
    };
    const handleComposition = (e) => {
      var _a, _b;
      const { value } = e.target;
      if (e.type === "compositionend") {
        isComposition.value = false;
        compositionValue.value = "";
        if (computedMaxLength.value && !maxLengthErrorOnly.value && computedValue.value.length >= computedMaxLength.value && getValueLength(value) > computedMaxLength.value) {
          keepControl();
          return;
        }
        emit("input", value, e);
        updateValue(value);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onInput) == null ? void 0 : _b.call(_a, e);
      } else {
        isComposition.value = true;
      }
    };
    const handleInput = (e) => {
      var _a, _b;
      const { value } = e.target;
      if (!isComposition.value) {
        if (computedMaxLength.value && !maxLengthErrorOnly.value && computedValue.value.length >= computedMaxLength.value && getValueLength(value) > computedMaxLength.value && e.inputType === "insertText") {
          keepControl();
          return;
        }
        emit("input", value, e);
        updateValue(value);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onInput) == null ? void 0 : _b.call(_a, e);
      } else {
        compositionValue.value = value;
      }
    };
    const handleClear = (ev) => {
      updateValue("");
      emitChange("", ev);
      emit("clear", ev);
    };
    vue.watch(modelValue, (value) => {
      if (value !== computedValue.value) {
        updateValue(value != null ? value : "", false);
      }
    });
    const getWrapperAttrs = (attr) => omit.omit(attrs, constant.INPUT_EVENTS);
    const getTextareaAttrs = (attr) => pick(attrs, constant.INPUT_EVENTS);
    const textareaAttrs = getTextareaAttrs();
    const mergeTextareaAttrs = vue.computed(() => {
      const attrs2 = {
        ...textareaAttrs,
        ...props.textareaAttrs
      };
      if (mergedError.value) {
        attrs2["aria-invalid"] = true;
      }
      return attrs2;
    });
    const wrapperCls = vue.computed(() => [
      `${prefixCls}-wrapper`,
      {
        [`${prefixCls}-focus`]: focused.value,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-error`]: mergedError.value,
        [`${prefixCls}-scroll`]: isScroll.value
      }
    ]);
    let styleDeclaration;
    const lineHeight = vue.ref(0);
    const outerHeight = vue.ref(0);
    const minHeight = vue.computed(() => {
      if (!is.isObject(props.autoSize) || !props.autoSize.minRows) {
        return 0;
      }
      return props.autoSize.minRows * lineHeight.value + outerHeight.value;
    });
    const maxHeight = vue.computed(() => {
      if (!is.isObject(props.autoSize) || !props.autoSize.maxRows) {
        return 0;
      }
      return props.autoSize.maxRows * lineHeight.value + outerHeight.value;
    });
    const getMirrorStyle = () => {
      const styles = utils.getSizeStyles(styleDeclaration);
      lineHeight.value = Number.parseInt(styles["line-height"] || 0, 10);
      outerHeight.value = Number.parseInt(styles["border-width"] || 0, 10) * 2 + Number.parseInt(styles["padding-top"] || 0, 10) + Number.parseInt(styles["padding-bottom"] || 0, 10);
      mirrorStyle.value = styles;
      vue.nextTick(() => {
        var _a;
        const mirrorHeight = (_a = mirrorRef.value) == null ? void 0 : _a.offsetHeight;
        let height = mirrorHeight != null ? mirrorHeight : 0;
        let overflow = "hidden";
        if (minHeight.value && height < minHeight.value) {
          height = minHeight.value;
        }
        if (maxHeight.value && height > maxHeight.value) {
          height = maxHeight.value;
          overflow = "auto";
        }
        textareaStyle.value = {
          height: `${height}px`,
          resize: "none",
          overflow
        };
      });
    };
    vue.onMounted(() => {
      if (textareaRef.value) {
        styleDeclaration = window.getComputedStyle(textareaRef.value);
        if (props.autoSize) {
          getMirrorStyle();
        }
      }
      computeIsScroll();
    });
    const handleResize = () => {
      if (props.autoSize && mirrorRef.value) {
        getMirrorStyle();
      }
      computeIsScroll();
    };
    const handleMousedown = (e) => {
      if (textareaRef.value && e.target !== textareaRef.value) {
        e.preventDefault();
        textareaRef.value.focus();
      }
    };
    const computeIsScroll = () => {
      if (textareaRef.value) {
        if (textareaRef.value.scrollHeight > textareaRef.value.offsetHeight) {
          if (!isScroll.value)
            isScroll.value = true;
        } else if (isScroll.value) {
          isScroll.value = false;
        }
      }
    };
    vue.watch(computedValue, () => {
      if (props.autoSize && mirrorRef.value) {
        getMirrorStyle();
      }
      computeIsScroll();
    });
    return {
      prefixCls,
      wrapperCls,
      textareaRef,
      textareaStyle,
      mirrorRef,
      mirrorStyle,
      computedValue,
      showClearBtn,
      valueLength,
      computedMaxLength,
      mergedDisabled,
      mergeTextareaAttrs,
      getWrapperAttrs,
      getTextareaAttrs,
      handleInput,
      handleFocus,
      handleBlur,
      handleComposition,
      handleClear,
      handleResize,
      handleMousedown
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.$refs.textareaRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.$refs.textareaRef) == null ? void 0 : _a.blur();
    }
  }
});
const _hoisted_1 = ["disabled", "value", "placeholder"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_resize_observer = vue.resolveComponent("resize-observer");
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_icon_hover = vue.resolveComponent("icon-hover");
  return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(_ctx.getWrapperAttrs(_ctx.$attrs), {
    class: _ctx.wrapperCls,
    onMousedown: _cache[7] || (_cache[7] = (...args) => _ctx.handleMousedown && _ctx.handleMousedown(...args))
  }), [
    _ctx.autoSize ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      ref: "mirrorRef",
      class: vue.normalizeClass(`${_ctx.prefixCls}-mirror`),
      style: vue.normalizeStyle(_ctx.mirrorStyle)
    }, vue.toDisplayString(`${_ctx.computedValue}
`), 7)) : vue.createCommentVNode("v-if", true),
    vue.createVNode(_component_resize_observer, { onResize: _ctx.handleResize }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("textarea", vue.mergeProps({ ref: "textareaRef" }, _ctx.mergeTextareaAttrs, {
          disabled: _ctx.mergedDisabled,
          class: _ctx.prefixCls,
          style: _ctx.textareaStyle,
          value: _ctx.computedValue,
          placeholder: _ctx.placeholder,
          onInput: _cache[0] || (_cache[0] = (...args) => _ctx.handleInput && _ctx.handleInput(...args)),
          onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.handleFocus && _ctx.handleFocus(...args)),
          onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args)),
          onCompositionstart: _cache[3] || (_cache[3] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
          onCompositionupdate: _cache[4] || (_cache[4] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args)),
          onCompositionend: _cache[5] || (_cache[5] = (...args) => _ctx.handleComposition && _ctx.handleComposition(...args))
        }), null, 16, _hoisted_1)
      ]),
      _: 1
    }, 8, ["onResize"]),
    vue.renderSlot(_ctx.$slots, "suffix"),
    _ctx.computedMaxLength && _ctx.showWordLimit ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-word-limit`)
    }, vue.toDisplayString(_ctx.valueLength) + "/" + vue.toDisplayString(_ctx.computedMaxLength), 3)) : vue.createCommentVNode("v-if", true),
    _ctx.showClearBtn ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-clear-btn`),
      onClick: _cache[6] || (_cache[6] = (...args) => _ctx.handleClear && _ctx.handleClear(...args))
    }, [
      vue.createVNode(_component_icon_hover, null, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_icon_close)
        ]),
        _: 1
      })
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 16);
}
var _Textarea = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Textarea;
