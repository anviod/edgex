"use strict";
var vue = require("vue");
var omit = require("../../_utils/omit.js");
var constant = require("../../_utils/constant.js");
var pick = require("../../_utils/pick.js");
var globalConfig = require("../../_utils/global-config.js");
var useInput = require("../../_hooks/use-input.js");
var useFormItem = require("../../_hooks/use-form-item.js");
var useSize = require("../../_hooks/use-size.js");
var InputLabel = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = (_a = props.baseCls) != null ? _a : globalConfig.getPrefixCls("input-label");
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      mergedError,
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
    const {
      inputRef,
      _focused,
      computedValue: computedInputValue,
      handleInput,
      handleComposition,
      handleFocus,
      handleBlur,
      handleMousedown
    } = useInput.useInput({
      modelValue: inputValue,
      emit,
      eventName: "inputValueChange",
      updateEventName: "update:inputValue",
      eventHandlers
    });
    const mergedFocused = vue.computed(() => {
      var _a2;
      return (_a2 = props.focused) != null ? _a2 : _focused.value;
    });
    const showInput = vue.computed(() => props.enabledInput && _focused.value || !props.modelValue);
    const formatLabel = () => {
      var _a2, _b;
      if (props.modelValue) {
        return (_b = (_a2 = props.formatLabel) == null ? void 0 : _a2.call(props, props.modelValue)) != null ? _b : props.modelValue.label;
      }
      return "";
    };
    const mergedPlaceholder = vue.computed(() => {
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-search`]: props.enabledInput,
      [`${prefixCls}-focus`]: mergedFocused.value,
      [`${prefixCls}-disabled`]: mergedDisabled.value,
      [`${prefixCls}-error`]: mergedError.value
    }]);
    const wrapperAttrs = vue.computed(() => omit.omit(attrs, constant.INPUT_EVENTS));
    const inputAttrs = vue.computed(() => pick(attrs, constant.INPUT_EVENTS));
    const render = () => vue.createVNode("span", vue.mergeProps(wrapperAttrs.value, {
      "class": cls.value,
      "title": formatLabel(),
      "onMousedown": handleMousedown
    }), [slots.prefix && vue.createVNode("span", {
      "class": `${prefixCls}-prefix`
    }, [slots.prefix()]), vue.createVNode("input", vue.mergeProps(inputAttrs.value, {
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
    }), null), vue.createVNode("span", {
      "class": [`${prefixCls}-value`, {
        [`${prefixCls}-value-hidden`]: showInput.value
      }]
    }, [renderLabel()]), slots.suffix && vue.createVNode("span", {
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
module.exports = InputLabel;
