import { defineComponent, toRefs, ref, computed, watch, onMounted, nextTick, resolveComponent, openBlock, createElementBlock, mergeProps, normalizeClass, normalizeStyle, toDisplayString, createCommentVNode, createVNode, withCtx, createElementVNode, renderSlot } from "vue";
import ResizeObserver from "../_components/resize-observer.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { getSizeStyles } from "./utils.js";
import { isUndefined, isNull, isObject, isFunction } from "../_utils/is.js";
import { omit } from "../_utils/omit.js";
import { INPUT_EVENTS } from "../_utils/constant.js";
import pick from "../_utils/pick.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useCursor } from "../_hooks/use-cursor.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Textarea",
  components: { ResizeObserver, IconHover, IconClose },
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
    const { disabled, error, modelValue } = toRefs(props);
    const prefixCls = getPrefixCls("textarea");
    const {
      mergedDisabled,
      mergedError: _mergedError,
      eventHandlers
    } = useFormItem({ disabled, error });
    const textareaRef = ref();
    const textareaStyle = ref();
    const mirrorRef = ref();
    const mirrorStyle = ref();
    const _value = ref(props.defaultValue);
    const computedValue = computed(() => {
      var _a;
      return (_a = modelValue.value) != null ? _a : _value.value;
    });
    const [recordCursor, setCursor] = useCursor(textareaRef);
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = "";
      }
    });
    const maxLengthErrorOnly = computed(
      () => isObject(props.maxLength) && Boolean(props.maxLength.errorOnly)
    );
    const computedMaxLength = computed(() => {
      if (isObject(props.maxLength)) {
        return props.maxLength.length;
      }
      return props.maxLength;
    });
    const getValueLength = (value) => {
      var _a;
      if (isFunction(props.wordLength)) {
        return props.wordLength(value);
      }
      return (_a = value.length) != null ? _a : 0;
    };
    const valueLength = computed(() => getValueLength(computedValue.value));
    const mergedError = computed(
      () => _mergedError.value || Boolean(
        computedMaxLength.value && maxLengthErrorOnly.value && valueLength.value > computedMaxLength.value
      )
    );
    const isScroll = ref(false);
    const focused = ref(false);
    const showClearBtn = computed(
      () => props.allowClear && !mergedDisabled.value && computedValue.value
    );
    const isComposition = ref(false);
    const compositionValue = ref("");
    const keepControl = () => {
      recordCursor();
      nextTick(() => {
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
    watch(modelValue, (value) => {
      if (value !== computedValue.value) {
        updateValue(value != null ? value : "", false);
      }
    });
    const getWrapperAttrs = (attr) => omit(attrs, INPUT_EVENTS);
    const getTextareaAttrs = (attr) => pick(attrs, INPUT_EVENTS);
    const textareaAttrs = getTextareaAttrs();
    const mergeTextareaAttrs = computed(() => {
      const attrs2 = {
        ...textareaAttrs,
        ...props.textareaAttrs
      };
      if (mergedError.value) {
        attrs2["aria-invalid"] = true;
      }
      return attrs2;
    });
    const wrapperCls = computed(() => [
      `${prefixCls}-wrapper`,
      {
        [`${prefixCls}-focus`]: focused.value,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-error`]: mergedError.value,
        [`${prefixCls}-scroll`]: isScroll.value
      }
    ]);
    let styleDeclaration;
    const lineHeight = ref(0);
    const outerHeight = ref(0);
    const minHeight = computed(() => {
      if (!isObject(props.autoSize) || !props.autoSize.minRows) {
        return 0;
      }
      return props.autoSize.minRows * lineHeight.value + outerHeight.value;
    });
    const maxHeight = computed(() => {
      if (!isObject(props.autoSize) || !props.autoSize.maxRows) {
        return 0;
      }
      return props.autoSize.maxRows * lineHeight.value + outerHeight.value;
    });
    const getMirrorStyle = () => {
      const styles = getSizeStyles(styleDeclaration);
      lineHeight.value = Number.parseInt(styles["line-height"] || 0, 10);
      outerHeight.value = Number.parseInt(styles["border-width"] || 0, 10) * 2 + Number.parseInt(styles["padding-top"] || 0, 10) + Number.parseInt(styles["padding-bottom"] || 0, 10);
      mirrorStyle.value = styles;
      nextTick(() => {
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
    onMounted(() => {
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
    watch(computedValue, () => {
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
  const _component_resize_observer = resolveComponent("resize-observer");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_icon_hover = resolveComponent("icon-hover");
  return openBlock(), createElementBlock("div", mergeProps(_ctx.getWrapperAttrs(_ctx.$attrs), {
    class: _ctx.wrapperCls,
    onMousedown: _cache[7] || (_cache[7] = (...args) => _ctx.handleMousedown && _ctx.handleMousedown(...args))
  }), [
    _ctx.autoSize ? (openBlock(), createElementBlock("div", {
      key: 0,
      ref: "mirrorRef",
      class: normalizeClass(`${_ctx.prefixCls}-mirror`),
      style: normalizeStyle(_ctx.mirrorStyle)
    }, toDisplayString(`${_ctx.computedValue}
`), 7)) : createCommentVNode("v-if", true),
    createVNode(_component_resize_observer, { onResize: _ctx.handleResize }, {
      default: withCtx(() => [
        createElementVNode("textarea", mergeProps({ ref: "textareaRef" }, _ctx.mergeTextareaAttrs, {
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
    renderSlot(_ctx.$slots, "suffix"),
    _ctx.computedMaxLength && _ctx.showWordLimit ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-word-limit`)
    }, toDisplayString(_ctx.valueLength) + "/" + toDisplayString(_ctx.computedMaxLength), 3)) : createCommentVNode("v-if", true),
    _ctx.showClearBtn ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-clear-btn`),
      onClick: _cache[6] || (_cache[6] = (...args) => _ctx.handleClear && _ctx.handleClear(...args))
    }, [
      createVNode(_component_icon_hover, null, {
        default: withCtx(() => [
          createVNode(_component_icon_close)
        ]),
        _: 1
      })
    ], 2)) : createCommentVNode("v-if", true)
  ], 16);
}
var _Textarea = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Textarea as default };
