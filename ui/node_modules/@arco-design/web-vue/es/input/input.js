import { defineComponent, toRefs, ref, computed, watch, createVNode, mergeProps, createTextVNode, nextTick } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { INPUT_EVENTS } from "../_utils/constant.js";
import FeedbackIcon from "../_components/feedback-icon.js";
import { Enter } from "../_utils/keycode.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import { omit } from "../_utils/omit.js";
import pick from "../_utils/pick.js";
import { isUndefined, isNull, isObject, isFunction } from "../_utils/is.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useSize } from "../_hooks/use-size.js";
import { useCursor } from "../_hooks/use-cursor.js";
var _Input = defineComponent({
  name: "Input",
  inheritAttrs: false,
  props: {
    modelValue: String,
    defaultValue: {
      type: String,
      default: ""
    },
    size: {
      type: String
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    maxLength: {
      type: [Number, Object],
      default: 0
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    wordLength: {
      type: Function
    },
    wordSlice: {
      type: Function
    },
    inputAttrs: {
      type: Object
    },
    type: {
      type: String,
      default: "text"
    },
    prepend: String,
    append: String
  },
  emits: {
    "update:modelValue": (value) => true,
    "input": (value, ev) => true,
    "change": (value, ev) => true,
    "pressEnter": (ev) => true,
    "clear": (ev) => true,
    "focus": (ev) => true,
    "blur": (ev) => true
  },
  setup(props, {
    emit,
    slots,
    attrs
  }) {
    const {
      size,
      disabled,
      error,
      modelValue
    } = toRefs(props);
    const prefixCls = getPrefixCls("input");
    const inputRef = ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError: _mergedError,
      feedback,
      eventHandlers
    } = useFormItem({
      size,
      disabled,
      error
    });
    const {
      mergedSize
    } = useSize(_mergedSize);
    const [recordCursor, setCursor] = useCursor(inputRef);
    const _value = ref(props.defaultValue);
    const computedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    let preValue = computedValue.value;
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = "";
      }
    });
    watch(computedValue, (value, oldValue) => {
      preValue = oldValue;
    });
    const focused = ref(false);
    const showClearBtn = computed(() => props.allowClear && !props.readonly && !mergedDisabled.value && Boolean(computedValue.value));
    const isComposition = ref(false);
    const compositionValue = ref("");
    const getValueLength = (value) => {
      var _a;
      if (isFunction(props.wordLength)) {
        return props.wordLength(value);
      }
      return (_a = value.length) != null ? _a : 0;
    };
    const valueLength = computed(() => getValueLength(computedValue.value));
    const mergedError = computed(() => _mergedError.value || Boolean(isObject(props.maxLength) && props.maxLength.errorOnly && valueLength.value > maxLength.value));
    const maxLengthErrorOnly = computed(() => isObject(props.maxLength) && Boolean(props.maxLength.errorOnly));
    const maxLength = computed(() => {
      if (isObject(props.maxLength)) {
        return props.maxLength.length;
      }
      return props.maxLength;
    });
    const defaultMaxLength = computed(() => {
      const bytePerChar = getValueLength("a");
      return Math.floor(maxLength.value / bytePerChar);
    });
    const updateValue = (value) => {
      var _a, _b;
      if (maxLength.value && !maxLengthErrorOnly.value && getValueLength(value) > maxLength.value) {
        value = (_b = (_a = props.wordSlice) == null ? void 0 : _a.call(props, value, maxLength.value)) != null ? _b : value.slice(0, defaultMaxLength.value);
      }
      _value.value = value;
      emit("update:modelValue", value);
    };
    const handleMousedown = (e) => {
      if (inputRef.value && e.target !== inputRef.value) {
        e.preventDefault();
        inputRef.value.focus();
      }
    };
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
      emit("focus", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      focused.value = false;
      emitChange(computedValue.value, ev);
      emit("blur", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    const handleComposition = (e) => {
      var _a, _b, _c;
      const {
        value,
        selectionStart,
        selectionEnd
      } = e.target;
      if (e.type === "compositionend") {
        isComposition.value = false;
        compositionValue.value = "";
        if (maxLength.value && !maxLengthErrorOnly.value && valueLength.value >= maxLength.value && getValueLength(value) > maxLength.value && selectionStart === selectionEnd) {
          keepControl();
          return;
        }
        updateValue(value);
        emit("input", value, e);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onInput) == null ? void 0 : _b.call(_a, e);
        keepControl();
      } else {
        isComposition.value = true;
        compositionValue.value = computedValue.value + ((_c = e.data) != null ? _c : "");
      }
    };
    const keepControl = () => {
      recordCursor();
      nextTick(() => {
        if (inputRef.value && computedValue.value !== inputRef.value.value) {
          inputRef.value.value = computedValue.value;
          setCursor();
        }
      });
    };
    const handleInput = (e) => {
      var _a, _b;
      const {
        value
      } = e.target;
      if (!isComposition.value) {
        if (maxLength.value && !maxLengthErrorOnly.value && valueLength.value >= maxLength.value && getValueLength(value) > maxLength.value && e.inputType === "insertText") {
          keepControl();
          return;
        }
        updateValue(value);
        emit("input", value, e);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onInput) == null ? void 0 : _b.call(_a, e);
        keepControl();
      }
    };
    const handleClear = (ev) => {
      updateValue("");
      emitChange("", ev);
      emit("clear", ev);
    };
    const handleKeyDown = (e) => {
      const keyCode = e.key || e.code;
      if (!isComposition.value && keyCode === Enter.key) {
        emitChange(computedValue.value, e);
        emit("pressEnter", e);
      }
    };
    const outerCls = computed(() => [`${prefixCls}-outer`, `${prefixCls}-outer-size-${mergedSize.value}`, {
      [`${prefixCls}-outer-has-suffix`]: Boolean(slots.suffix),
      [`${prefixCls}-outer-disabled`]: mergedDisabled.value
    }]);
    const wrapperCls = computed(() => [`${prefixCls}-wrapper`, {
      [`${prefixCls}-error`]: mergedError.value,
      [`${prefixCls}-disabled`]: mergedDisabled.value,
      [`${prefixCls}-focus`]: focused.value
    }]);
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`]);
    const wrapperAttrs = computed(() => omit(attrs, INPUT_EVENTS));
    const inputAttrs = computed(() => pick(attrs, INPUT_EVENTS));
    const mergeInputAttrs = computed(() => {
      const attrs2 = {
        ...inputAttrs.value,
        ...props.inputAttrs
      };
      if (mergedError.value) {
        attrs2["aria-invalid"] = true;
      }
      return attrs2;
    });
    const renderInput = (hasOuter) => {
      var _a;
      return createVNode("span", mergeProps({
        "class": wrapperCls.value,
        "onMousedown": handleMousedown
      }, !hasOuter ? wrapperAttrs.value : void 0), [slots.prefix && createVNode("span", {
        "class": `${prefixCls}-prefix`
      }, [slots.prefix()]), createVNode("input", mergeProps({
        "ref": inputRef,
        "class": cls.value,
        "value": computedValue.value,
        "type": props.type,
        "placeholder": props.placeholder,
        "readonly": props.readonly,
        "disabled": mergedDisabled.value,
        "onInput": handleInput,
        "onKeydown": handleKeyDown,
        "onFocus": handleFocus,
        "onBlur": handleBlur,
        "onCompositionstart": handleComposition,
        "onCompositionupdate": handleComposition,
        "onCompositionend": handleComposition
      }, mergeInputAttrs.value), null), showClearBtn.value && createVNode(IconHover, {
        "prefix": prefixCls,
        "class": `${prefixCls}-clear-btn`,
        "onClick": handleClear
      }, {
        default: () => [createVNode(IconClose, null, null)]
      }), (slots.suffix || Boolean(props.maxLength) && props.showWordLimit || Boolean(feedback.value)) && createVNode("span", {
        "class": [`${prefixCls}-suffix`, {
          [`${prefixCls}-suffix-has-feedback`]: feedback.value
        }]
      }, [Boolean(props.maxLength) && props.showWordLimit && createVNode("span", {
        "class": `${prefixCls}-word-limit`
      }, [valueLength.value, createTextVNode("/"), maxLength.value]), (_a = slots.suffix) == null ? void 0 : _a.call(slots), Boolean(feedback.value) && createVNode(FeedbackIcon, {
        "type": feedback.value
      }, null)])]);
    };
    const render = () => {
      if (slots.prepend || slots.append || props.prepend || props.append) {
        return createVNode("span", mergeProps({
          "class": outerCls.value
        }, wrapperAttrs.value), [(slots.prepend || props.prepend) && createVNode("span", {
          "class": `${prefixCls}-prepend`
        }, [slots.prepend ? slots.prepend() : props.prepend]), renderInput(true), (slots.append || props.append) && createVNode("span", {
          "class": `${prefixCls}-append`
        }, [slots.append ? slots.append() : props.append])]);
      }
      return renderInput();
    };
    return {
      inputRef,
      render
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.blur();
    }
  },
  render() {
    return this.render();
  }
});
export { _Input as default };
