import { defineComponent, toRefs, computed, createVNode, mergeProps } from "vue";
import { omit } from "../../_utils/omit.js";
import { INPUT_EVENTS } from "../../_utils/constant.js";
import pick from "../../_utils/pick.js";
import { getPrefixCls } from "../../_utils/global-config.js";
import { useInput } from "../../_hooks/use-input.js";
import { useFormItem } from "../../_hooks/use-form-item.js";
import { useSize } from "../../_hooks/use-size.js";
var InputLabel = defineComponent({
  name: "InputLabel",
  inheritAttrs: false,
  props: {
    modelValue: Object,
    inputValue: {
      type: String,
      default: ""
    },
    enabledInput: Boolean,
    formatLabel: Function,
    placeholder: String,
    retainInputValue: Boolean,
    disabled: Boolean,
    baseCls: String,
    size: String,
    error: Boolean,
    focused: Boolean,
    uninjectFormItemContext: Boolean
  },
  emits: ["update:inputValue", "inputValueChange", "focus", "blur"],
  setup(props, {
    attrs,
    emit,
    slots
  }) {
    var _a;
    const {
      size,
      disabled,
      error,
      inputValue,
      uninjectFormItemContext
    } = toRefs(props);
    const prefixCls = (_a = props.baseCls) != null ? _a : getPrefixCls("input-label");
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
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
    const {
      inputRef,
      _focused,
      computedValue: computedInputValue,
      handleInput,
      handleComposition,
      handleFocus,
      handleBlur,
      handleMousedown
    } = useInput({
      modelValue: inputValue,
      emit,
      eventName: "inputValueChange",
      updateEventName: "update:inputValue",
      eventHandlers
    });
    const mergedFocused = computed(() => {
      var _a2;
      return (_a2 = props.focused) != null ? _a2 : _focused.value;
    });
    const showInput = computed(() => props.enabledInput && _focused.value || !props.modelValue);
    const formatLabel = () => {
      var _a2, _b;
      if (props.modelValue) {
        return (_b = (_a2 = props.formatLabel) == null ? void 0 : _a2.call(props, props.modelValue)) != null ? _b : props.modelValue.label;
      }
      return "";
    };
    const mergedPlaceholder = computed(() => {
      if (props.enabledInput && props.modelValue) {
        return formatLabel();
      }
      return props.placeholder;
    });
    const renderLabel = () => {
      var _a2, _b;
      if (props.modelValue) {
        return (_b = (_a2 = slots.default) == null ? void 0 : _a2.call(slots, {
          data: props.modelValue
        })) != null ? _b : formatLabel();
      }
      return null;
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-search`]: props.enabledInput,
      [`${prefixCls}-focus`]: mergedFocused.value,
      [`${prefixCls}-disabled`]: mergedDisabled.value,
      [`${prefixCls}-error`]: mergedError.value
    }]);
    const wrapperAttrs = computed(() => omit(attrs, INPUT_EVENTS));
    const inputAttrs = computed(() => pick(attrs, INPUT_EVENTS));
    const render = () => createVNode("span", mergeProps(wrapperAttrs.value, {
      "class": cls.value,
      "title": formatLabel(),
      "onMousedown": handleMousedown
    }), [slots.prefix && createVNode("span", {
      "class": `${prefixCls}-prefix`
    }, [slots.prefix()]), createVNode("input", mergeProps(inputAttrs.value, {
      "ref": inputRef,
      "class": [`${prefixCls}-input`, {
        [`${prefixCls}-input-hidden`]: !showInput.value
      }],
      "value": computedInputValue.value,
      "readonly": !props.enabledInput,
      "placeholder": mergedPlaceholder.value,
      "disabled": mergedDisabled.value,
      "onInput": handleInput,
      "onFocus": handleFocus,
      "onBlur": handleBlur,
      "onCompositionstart": handleComposition,
      "onCompositionupdate": handleComposition,
      "onCompositionend": handleComposition
    }), null), createVNode("span", {
      "class": [`${prefixCls}-value`, {
        [`${prefixCls}-value-hidden`]: showInput.value
      }]
    }, [renderLabel()]), slots.suffix && createVNode("span", {
      "class": `${prefixCls}-suffix`
    }, [slots.suffix()])]);
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
export { InputLabel as default };
