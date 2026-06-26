"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var constant = require("../_utils/constant.js");
var feedbackIcon = require("../_components/feedback-icon.js");
var keycode = require("../_utils/keycode.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-close/index.js");
var omit = require("../_utils/omit.js");
var pick = require("../_utils/pick.js");
var is = require("../_utils/is.js");
var useFormItem = require("../_hooks/use-form-item.js");
var useSize = require("../_hooks/use-size.js");
var useCursor = require("../_hooks/use-cursor.js");
var _Input = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("input");
    const inputRef = vue.ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError: _mergedError,
      feedback,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      disabled,
      error
    });
    const {
      mergedSize
    } = useSize.useSize(_mergedSize);
    const [recordCursor, setCursor] = useCursor.useCursor(inputRef);
    const _value = vue.ref(props.defaultValue);
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    let preValue = computedValue.value;
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = "";
      }
    });
    vue.watch(computedValue, (value, oldValue) => {
      preValue = oldValue;
    });
    const focused = vue.ref(false);
    const showClearBtn = vue.computed(() => props.allowClear && !props.readonly && !mergedDisabled.value && Boolean(computedValue.value));
    const isComposition = vue.ref(false);
    const compositionValue = vue.ref("");
    const getValueLength = (value) => {
      var _a;
      if (is.isFunction(props.wordLength)) {
        return props.wordLength(value);
      }
      return (_a = value.length) != null ? _a : 0;
    };
    const valueLength = vue.computed(() => getValueLength(computedValue.value));
    const mergedError = vue.computed(() => _mergedError.value || Boolean(is.isObject(props.maxLength) && props.maxLength.errorOnly && valueLength.value > maxLength.value));
    const maxLengthErrorOnly = vue.computed(() => is.isObject(props.maxLength) && Boolean(props.maxLength.errorOnly));
    const maxLength = vue.computed(() => {
      if (is.isObject(props.maxLength)) {
        return props.maxLength.length;
      }
      return props.maxLength;
    });
    const defaultMaxLength = vue.computed(() => {
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
      vue.nextTick(() => {
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
      if (!isComposition.value && keyCode === keycode.Enter.key) {
        emitChange(computedValue.value, e);
        emit("pressEnter", e);
      }
    };
    const outerCls = vue.computed(() => [`${prefixCls}-outer`, `${prefixCls}-outer-size-${mergedSize.value}`, {
      [`${prefixCls}-outer-has-suffix`]: Boolean(slots.suffix),
      [`${prefixCls}-outer-disabled`]: mergedDisabled.value
    }]);
    const wrapperCls = vue.computed(() => [`${prefixCls}-wrapper`, {
      [`${prefixCls}-error`]: mergedError.value,
      [`${prefixCls}-disabled`]: mergedDisabled.value,
      [`${prefixCls}-focus`]: focused.value
    }]);
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`]);
    const wrapperAttrs = vue.computed(() => omit.omit(attrs, constant.INPUT_EVENTS));
    const inputAttrs = vue.computed(() => pick(attrs, constant.INPUT_EVENTS));
    const mergeInputAttrs = vue.computed(() => {
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
      return vue.createVNode("span", vue.mergeProps({
        "class": wrapperCls.value,
        "onMousedown": handleMousedown
      }, !hasOuter ? wrapperAttrs.value : void 0), [slots.prefix && vue.createVNode("span", {
        "class": `${prefixCls}-prefix`
      }, [slots.prefix()]), vue.createVNode("input", vue.mergeProps({
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
      }, mergeInputAttrs.value), null), showClearBtn.value && vue.createVNode(iconHover, {
        "prefix": prefixCls,
        "class": `${prefixCls}-clear-btn`,
        "onClick": handleClear
      }, {
        default: () => [vue.createVNode(index, null, null)]
      }), (slots.suffix || Boolean(props.maxLength) && props.showWordLimit || Boolean(feedback.value)) && vue.createVNode("span", {
        "class": [`${prefixCls}-suffix`, {
          [`${prefixCls}-suffix-has-feedback`]: feedback.value
        }]
      }, [Boolean(props.maxLength) && props.showWordLimit && vue.createVNode("span", {
        "class": `${prefixCls}-word-limit`
      }, [valueLength.value, vue.createTextVNode("/"), maxLength.value]), (_a = slots.suffix) == null ? void 0 : _a.call(slots), Boolean(feedback.value) && vue.createVNode(feedbackIcon, {
        "type": feedback.value
      }, null)])]);
    };
    const render = () => {
      if (slots.prepend || slots.append || props.prepend || props.append) {
        return vue.createVNode("span", vue.mergeProps({
          "class": outerCls.value
        }, wrapperAttrs.value), [(slots.prepend || props.prepend) && vue.createVNode("span", {
          "class": `${prefixCls}-prepend`
        }, [slots.prepend ? slots.prepend() : props.prepend]), renderInput(true), (slots.append || props.append) && vue.createVNode("span", {
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
module.exports = _Input;
