"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var constant = require("../_utils/constant.js");
var keycode = require("../_utils/keycode.js");
var utils = require("./utils.js");
var index = require("../tag/index.js");
var iconHover = require("../_components/icon-hover.js");
var index$1 = require("../icon/icon-close/index.js");
var omit = require("../_utils/omit.js");
var pick = require("../_utils/pick.js");
var resizeObserver = require("../_components/resize-observer.js");
var feedbackIcon = require("../_components/feedback-icon.js");
var useFormItem = require("../_hooks/use-form-item.js");
var useSize = require("../_hooks/use-size.js");
var is = require("../_utils/is.js");
const DEFAULT_FIELD_NAMES = {
  value: "value",
  label: "label",
  closable: "closable",
  tagProps: "tagProps"
};
var _InputTag = vue.defineComponent({
  name: "InputTag",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    inputValue: String,
    defaultInputValue: {
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
    readonly: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    maxTagCount: {
      type: Number,
      default: 0
    },
    retainInputValue: {
      type: [Boolean, Object],
      default: false
    },
    formatTag: {
      type: Function
    },
    uniqueValue: {
      type: Boolean,
      default: false
    },
    fieldNames: {
      type: Object
    },
    tagNowrap: {
      type: Boolean,
      default: false
    },
    baseCls: String,
    focused: Boolean,
    disabledInput: Boolean,
    uninjectFormItemContext: Boolean
  },
  emits: {
    "update:modelValue": (value) => true,
    "update:inputValue": (inputValue) => true,
    "change": (value, ev) => true,
    "inputValueChange": (inputValue, ev) => true,
    "pressEnter": (inputValue, ev) => true,
    "remove": (removed, ev) => true,
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
      uninjectFormItemContext,
      modelValue
    } = vue.toRefs(props);
    const prefixCls = props.baseCls || globalConfig.getPrefixCls("input-tag");
    const inputRef = vue.ref();
    const mirrorRef = vue.ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      disabled,
      error,
      uninject: uninjectFormItemContext == null ? void 0 : uninjectFormItemContext.value
    });
    const {
      mergedSize
    } = useSize.useSize(_mergedSize);
    const mergedFieldNames = vue.computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames
    }));
    const _focused = vue.ref(false);
    const _value = vue.ref(props.defaultValue);
    const _inputValue = vue.ref(props.defaultInputValue);
    const isComposition = vue.ref(false);
    const compositionValue = vue.ref("");
    const retainInputValue = vue.computed(() => {
      if (is.isObject(props.retainInputValue)) {
        return {
          create: false,
          blur: false,
          ...props.retainInputValue
        };
      }
      return {
        create: props.retainInputValue,
        blur: props.retainInputValue
      };
    });
    const inputStyle = vue.reactive({
      width: "12px"
    });
    const mergedFocused = vue.computed(() => props.focused || _focused.value);
    const updateInputValue = (value, ev) => {
      _inputValue.value = value;
      emit("update:inputValue", value);
      emit("inputValueChange", value, ev);
    };
    const handleComposition = (ev) => {
      var _a;
      const {
        value
      } = ev.target;
      if (ev.type === "compositionend") {
        isComposition.value = false;
        compositionValue.value = "";
        updateInputValue(value, ev);
        vue.nextTick(() => {
          if (inputRef.value && computedInputValue.value !== inputRef.value.value) {
            inputRef.value.value = computedInputValue.value;
          }
        });
      } else {
        isComposition.value = true;
        compositionValue.value = computedInputValue.value + ((_a = ev.data) != null ? _a : "");
      }
    };
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    const computedInputValue = vue.computed(() => {
      var _a;
      return (_a = props.inputValue) != null ? _a : _inputValue.value;
    });
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = [];
      }
    });
    const handleMousedown = (e) => {
      if (inputRef.value && e.target !== inputRef.value) {
        e.preventDefault();
        inputRef.value.focus();
      }
    };
    const handleInput = (ev) => {
      const {
        value
      } = ev.target;
      if (!isComposition.value) {
        updateInputValue(value, ev);
        vue.nextTick(() => {
          if (inputRef.value && computedInputValue.value !== inputRef.value.value) {
            inputRef.value.value = computedInputValue.value;
          }
        });
      }
    };
    const valueData = vue.computed(() => utils.getValueData(computedValue.value, mergedFieldNames.value));
    const tags = vue.computed(() => {
      if (props.maxTagCount > 0) {
        const invisibleTags = valueData.value.length - props.maxTagCount;
        if (invisibleTags > 0) {
          const result = valueData.value.slice(0, props.maxTagCount);
          const raw = {
            value: "__arco__more",
            label: `+${invisibleTags}...`,
            closable: false
          };
          result.push({
            raw,
            ...raw
          });
          return result;
        }
      }
      return valueData.value;
    });
    const updateValue = (value, ev) => {
      var _a, _b;
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value, ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a, ev);
    };
    const handleRemove = (value, index2, e) => {
      var _a;
      const newValue = (_a = computedValue.value) == null ? void 0 : _a.filter((_, i) => i !== index2);
      updateValue(newValue, e);
      emit("remove", value, e);
    };
    const handleClear = (e) => {
      const newValue = [];
      updateValue(newValue, e);
      emit("clear", e);
    };
    const showClearBtn = vue.computed(() => !mergedDisabled.value && !props.readonly && props.allowClear && Boolean(computedValue.value.length));
    const handlePressEnter = (e) => {
      var _a;
      if (computedInputValue.value) {
        e.preventDefault();
        if (props.uniqueValue && ((_a = computedValue.value) == null ? void 0 : _a.includes(computedInputValue.value))) {
          emit("pressEnter", computedInputValue.value, e);
          return;
        }
        const newValue = computedValue.value.concat(computedInputValue.value);
        updateValue(newValue, e);
        emit("pressEnter", computedInputValue.value, e);
        if (!retainInputValue.value.create) {
          updateInputValue("", e);
        }
      }
    };
    const handleFocus = (ev) => {
      var _a, _b;
      _focused.value = true;
      emit("focus", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      _focused.value = false;
      if (!retainInputValue.value.blur && computedInputValue.value) {
        updateInputValue("", ev);
      }
      emit("blur", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    const getLastClosableIndex = () => {
      for (let i = valueData.value.length - 1; i >= 0; i--) {
        if (valueData.value[i].closable) {
          return i;
        }
      }
      return -1;
    };
    const handleKeyDown = (e) => {
      if (mergedDisabled.value || props.readonly) {
        return;
      }
      const keyCode = e.key || e.code;
      if (!isComposition.value && computedInputValue.value && keyCode === keycode.Enter.key) {
        handlePressEnter(e);
      }
      if (!isComposition.value && tags.value.length > 0 && !computedInputValue.value && keyCode === keycode.Backspace.key) {
        const lastIndex = getLastClosableIndex();
        if (lastIndex >= 0) {
          handleRemove(valueData.value[lastIndex].value, lastIndex, e);
        }
      }
    };
    const setInputWidth = (width) => {
      if (width > 12) {
        inputStyle.width = `${width}px`;
      } else {
        inputStyle.width = "12px";
      }
    };
    vue.onMounted(() => {
      if (mirrorRef.value) {
        setInputWidth(mirrorRef.value.offsetWidth);
      }
    });
    const handleResize = () => {
      if (mirrorRef.value) {
        setInputWidth(mirrorRef.value.offsetWidth);
      }
    };
    vue.watch(computedInputValue, (value) => {
      if (inputRef.value && !isComposition.value && value !== inputRef.value.value) {
        inputRef.value.value = value;
      }
    });
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-disabled`]: mergedDisabled.value,
      [`${prefixCls}-disabled-input`]: props.disabledInput,
      [`${prefixCls}-error`]: mergedError.value,
      [`${prefixCls}-focus`]: mergedFocused.value,
      [`${prefixCls}-readonly`]: props.readonly,
      [`${prefixCls}-has-tag`]: tags.value.length > 0,
      [`${prefixCls}-has-prefix`]: Boolean(slots.prefix),
      [`${prefixCls}-has-suffix`]: Boolean(slots.suffix) || showClearBtn.value || feedback.value,
      [`${prefixCls}-has-placeholder`]: !computedValue.value.length
    }]);
    const wrapperAttrs = vue.computed(() => omit.omit(attrs, constant.INPUT_EVENTS));
    const inputAttrs = vue.computed(() => pick(attrs, constant.INPUT_EVENTS));
    const render = () => {
      var _a;
      return vue.createVNode("span", vue.mergeProps({
        "class": cls.value,
        "onMousedown": handleMousedown
      }, wrapperAttrs.value), [vue.createVNode(resizeObserver, {
        "onResize": handleResize
      }, {
        default: () => [vue.createVNode("span", {
          "ref": mirrorRef,
          "class": `${prefixCls}-mirror`
        }, [tags.value.length > 0 ? compositionValue.value || computedInputValue.value : compositionValue.value || computedInputValue.value || props.placeholder])]
      }), slots.prefix && vue.createVNode("span", {
        "class": `${prefixCls}-prefix`
      }, [slots.prefix()]), vue.createVNode(vue.TransitionGroup, {
        "tag": "span",
        "name": "input-tag-zoom",
        "class": [`${prefixCls}-inner`, {
          [`${prefixCls}-nowrap`]: props.tagNowrap
        }]
      }, {
        default: () => [tags.value.map((item, index$12) => vue.createVNode(index, vue.mergeProps({
          "key": `tag-${item.value}`,
          "class": `${prefixCls}-tag`,
          "closable": !mergedDisabled.value && !props.readonly && item.closable,
          "visible": true,
          "nowrap": props.tagNowrap
        }, item.tagProps, {
          "onClose": (ev) => handleRemove(item.value, index$12, ev)
        }), {
          default: () => {
            var _a2, _b, _c, _d;
            return [(_d = (_c = (_a2 = slots.tag) == null ? void 0 : _a2.call(slots, {
              data: item.raw
            })) != null ? _c : (_b = props.formatTag) == null ? void 0 : _b.call(props, item.raw)) != null ? _d : item.label];
          }
        })), vue.createVNode("input", vue.mergeProps(inputAttrs.value, {
          "ref": inputRef,
          "key": "input-tag-input",
          "class": `${prefixCls}-input`,
          "style": inputStyle,
          "placeholder": tags.value.length === 0 ? props.placeholder : void 0,
          "disabled": mergedDisabled.value,
          "readonly": props.readonly || props.disabledInput,
          "onInput": handleInput,
          "onKeydown": handleKeyDown,
          "onFocus": handleFocus,
          "onBlur": handleBlur,
          "onCompositionstart": handleComposition,
          "onCompositionupdate": handleComposition,
          "onCompositionend": handleComposition
        }), null)]
      }), showClearBtn.value && vue.createVNode(iconHover, {
        "class": `${prefixCls}-clear-btn`,
        "onClick": handleClear,
        "onMousedown": (e) => e.stopPropagation()
      }, {
        default: () => [vue.createVNode(index$1, null, null)]
      }), (slots.suffix || Boolean(feedback.value)) && vue.createVNode("span", {
        "class": `${prefixCls}-suffix`
      }, [(_a = slots.suffix) == null ? void 0 : _a.call(slots), Boolean(feedback.value) && vue.createVNode(feedbackIcon, {
        "type": feedback.value
      }, null)])]);
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
module.exports = _InputTag;
