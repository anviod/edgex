import { defineComponent, toRefs, ref, computed, reactive, watch, onMounted, createVNode, mergeProps, TransitionGroup, nextTick } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { INPUT_EVENTS } from "../_utils/constant.js";
import { Enter, Backspace } from "../_utils/keycode.js";
import { getValueData } from "./utils.js";
import Tag from "../tag/index.js";
import IconHover from "../_components/icon-hover.js";
import IconClose from "../icon/icon-close/index.js";
import { omit } from "../_utils/omit.js";
import pick from "../_utils/pick.js";
import ResizeObserver from "../_components/resize-observer.js";
import FeedbackIcon from "../_components/feedback-icon.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useSize } from "../_hooks/use-size.js";
import { isObject, isUndefined, isNull } from "../_utils/is.js";
const DEFAULT_FIELD_NAMES = {
  value: "value",
  label: "label",
  closable: "closable",
  tagProps: "tagProps"
};
var _InputTag = defineComponent({
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
    } = toRefs(props);
    const prefixCls = props.baseCls || getPrefixCls("input-tag");
    const inputRef = ref();
    const mirrorRef = ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
      feedback,
      eventHandlers
    } = useFormItem({
      size,
      disabled,
      error,
      uninject: uninjectFormItemContext == null ? void 0 : uninjectFormItemContext.value
    });
    const {
      mergedSize
    } = useSize(_mergedSize);
    const mergedFieldNames = computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames
    }));
    const _focused = ref(false);
    const _value = ref(props.defaultValue);
    const _inputValue = ref(props.defaultInputValue);
    const isComposition = ref(false);
    const compositionValue = ref("");
    const retainInputValue = computed(() => {
      if (isObject(props.retainInputValue)) {
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
    const inputStyle = reactive({
      width: "12px"
    });
    const mergedFocused = computed(() => props.focused || _focused.value);
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
        nextTick(() => {
          if (inputRef.value && computedInputValue.value !== inputRef.value.value) {
            inputRef.value.value = computedInputValue.value;
          }
        });
      } else {
        isComposition.value = true;
        compositionValue.value = computedInputValue.value + ((_a = ev.data) != null ? _a : "");
      }
    };
    const computedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    const computedInputValue = computed(() => {
      var _a;
      return (_a = props.inputValue) != null ? _a : _inputValue.value;
    });
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
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
        nextTick(() => {
          if (inputRef.value && computedInputValue.value !== inputRef.value.value) {
            inputRef.value.value = computedInputValue.value;
          }
        });
      }
    };
    const valueData = computed(() => getValueData(computedValue.value, mergedFieldNames.value));
    const tags = computed(() => {
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
    const handleRemove = (value, index, e) => {
      var _a;
      const newValue = (_a = computedValue.value) == null ? void 0 : _a.filter((_, i) => i !== index);
      updateValue(newValue, e);
      emit("remove", value, e);
    };
    const handleClear = (e) => {
      const newValue = [];
      updateValue(newValue, e);
      emit("clear", e);
    };
    const showClearBtn = computed(() => !mergedDisabled.value && !props.readonly && props.allowClear && Boolean(computedValue.value.length));
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
      if (!isComposition.value && computedInputValue.value && keyCode === Enter.key) {
        handlePressEnter(e);
      }
      if (!isComposition.value && tags.value.length > 0 && !computedInputValue.value && keyCode === Backspace.key) {
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
    onMounted(() => {
      if (mirrorRef.value) {
        setInputWidth(mirrorRef.value.offsetWidth);
      }
    });
    const handleResize = () => {
      if (mirrorRef.value) {
        setInputWidth(mirrorRef.value.offsetWidth);
      }
    };
    watch(computedInputValue, (value) => {
      if (inputRef.value && !isComposition.value && value !== inputRef.value.value) {
        inputRef.value.value = value;
      }
    });
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
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
    const wrapperAttrs = computed(() => omit(attrs, INPUT_EVENTS));
    const inputAttrs = computed(() => pick(attrs, INPUT_EVENTS));
    const render = () => {
      var _a;
      return createVNode("span", mergeProps({
        "class": cls.value,
        "onMousedown": handleMousedown
      }, wrapperAttrs.value), [createVNode(ResizeObserver, {
        "onResize": handleResize
      }, {
        default: () => [createVNode("span", {
          "ref": mirrorRef,
          "class": `${prefixCls}-mirror`
        }, [tags.value.length > 0 ? compositionValue.value || computedInputValue.value : compositionValue.value || computedInputValue.value || props.placeholder])]
      }), slots.prefix && createVNode("span", {
        "class": `${prefixCls}-prefix`
      }, [slots.prefix()]), createVNode(TransitionGroup, {
        "tag": "span",
        "name": "input-tag-zoom",
        "class": [`${prefixCls}-inner`, {
          [`${prefixCls}-nowrap`]: props.tagNowrap
        }]
      }, {
        default: () => [tags.value.map((item, index) => createVNode(Tag, mergeProps({
          "key": `tag-${item.value}`,
          "class": `${prefixCls}-tag`,
          "closable": !mergedDisabled.value && !props.readonly && item.closable,
          "visible": true,
          "nowrap": props.tagNowrap
        }, item.tagProps, {
          "onClose": (ev) => handleRemove(item.value, index, ev)
        }), {
          default: () => {
            var _a2, _b, _c, _d;
            return [(_d = (_c = (_a2 = slots.tag) == null ? void 0 : _a2.call(slots, {
              data: item.raw
            })) != null ? _c : (_b = props.formatTag) == null ? void 0 : _b.call(props, item.raw)) != null ? _d : item.label];
          }
        })), createVNode("input", mergeProps(inputAttrs.value, {
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
      }), showClearBtn.value && createVNode(IconHover, {
        "class": `${prefixCls}-clear-btn`,
        "onClick": handleClear,
        "onMousedown": (e) => e.stopPropagation()
      }, {
        default: () => [createVNode(IconClose, null, null)]
      }), (slots.suffix || Boolean(feedback.value)) && createVNode("span", {
        "class": `${prefixCls}-suffix`
      }, [(_a = slots.suffix) == null ? void 0 : _a.call(slots), Boolean(feedback.value) && createVNode(FeedbackIcon, {
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
export { _InputTag as default };
