import { defineComponent, toRefs, ref, computed, watch, createVNode, Fragment } from "vue";
import NP from "number-precision";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber, isUndefined } from "../_utils/is.js";
import IconUp from "../icon/icon-up/index.js";
import IconDown from "../icon/icon-down/index.js";
import IconPlus from "../icon/icon-plus/index.js";
import IconMinus from "../icon/icon-minus/index.js";
import Button from "../button/index.js";
import Input from "../input/index.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useSize } from "../_hooks/use-size.js";
import { getKeyDownHandler, KEYBOARD_KEY } from "../_utils/keyboard.js";
const FIRST_DELAY = 800;
const SPEED = 150;
NP.enableBoundaryChecking(false);
var _InputNumber = defineComponent({
  name: "InputNumber",
  props: {
    modelValue: Number,
    defaultValue: Number,
    mode: {
      type: String,
      default: "embed"
    },
    precision: Number,
    step: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: String,
    hideButton: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    modelEvent: {
      type: String,
      default: "change"
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    inputAttrs: {
      type: Object
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value, ev) => true,
    "focus": (ev) => true,
    "blur": (ev) => true,
    "clear": (ev) => true,
    "input": (value, inputValue, ev) => true,
    "keydown": (ev) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    var _a;
    const {
      size,
      disabled
    } = toRefs(props);
    const prefixCls = getPrefixCls("input-number");
    const inputRef = ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      eventHandlers
    } = useFormItem({
      size,
      disabled
    });
    const {
      mergedSize
    } = useSize(_mergedSize);
    const mergedPrecision = computed(() => {
      if (isNumber(props.precision)) {
        const decimal = `${props.step}`.split(".")[1];
        const stepPrecision = decimal && decimal.length || 0;
        return Math.max(stepPrecision, props.precision);
      }
      return void 0;
    });
    const getStringValue = (number) => {
      var _a2, _b;
      if (!isNumber(number)) {
        return "";
      }
      const numString = mergedPrecision.value ? number.toFixed(mergedPrecision.value) : String(number);
      return (_b = (_a2 = props.formatter) == null ? void 0 : _a2.call(props, numString)) != null ? _b : numString;
    };
    const _value = ref(getStringValue((_a = props.modelValue) != null ? _a : props.defaultValue));
    const valueNumber = computed(() => {
      var _a2, _b;
      if (!_value.value) {
        return void 0;
      }
      const number = Number((_b = (_a2 = props.parser) == null ? void 0 : _a2.call(props, _value.value)) != null ? _b : _value.value);
      return Number.isNaN(number) ? void 0 : number;
    });
    const isMin = ref(isNumber(valueNumber.value) && valueNumber.value <= props.min);
    const isMax = ref(isNumber(valueNumber.value) && valueNumber.value >= props.max);
    let repeatTimer = 0;
    const clearRepeatTimer = () => {
      if (repeatTimer) {
        window.clearTimeout(repeatTimer);
        repeatTimer = 0;
      }
    };
    const getLegalValue = (value) => {
      if (isUndefined(value)) {
        return void 0;
      }
      if (isNumber(props.min) && value < props.min) {
        value = props.min;
      }
      if (isNumber(props.max) && value > props.max) {
        value = props.max;
      }
      return isNumber(mergedPrecision.value) ? NP.round(value, mergedPrecision.value) : value;
    };
    const updateNumberStatus = (number) => {
      let _isMin = false;
      let _isMax = false;
      if (isNumber(number)) {
        if (number <= props.min) {
          _isMin = true;
        }
        if (number >= props.max) {
          _isMax = true;
        }
      }
      if (isMax.value !== _isMax) {
        isMax.value = _isMax;
      }
      if (isMin.value !== _isMin) {
        isMin.value = _isMin;
      }
    };
    const handleExceedRange = () => {
      const finalValue = getLegalValue(valueNumber.value);
      const stringValue = getStringValue(finalValue);
      if (finalValue !== valueNumber.value || _value.value !== stringValue) {
        _value.value = stringValue;
      }
      emit("update:modelValue", finalValue);
    };
    watch(() => [props.max, props.min], () => {
      handleExceedRange();
      updateNumberStatus(valueNumber.value);
    });
    const nextStep = (method, event) => {
      if (mergedDisabled.value || method === "plus" && isMax.value || method === "minus" && isMin.value) {
        return;
      }
      let nextValue;
      if (isNumber(valueNumber.value)) {
        nextValue = getLegalValue(NP[method](valueNumber.value, props.step));
      } else {
        nextValue = props.min === -Infinity ? 0 : props.min;
      }
      _value.value = getStringValue(nextValue);
      updateNumberStatus(nextValue);
      emit("update:modelValue", nextValue);
      emit("change", nextValue, event);
    };
    const handleStepButton = (event, method, needRepeat = false) => {
      var _a2;
      event.preventDefault();
      if (props.readOnly)
        return;
      (_a2 = inputRef.value) == null ? void 0 : _a2.focus();
      nextStep(method, event);
      if (needRepeat) {
        repeatTimer = window.setTimeout(() => event.target.dispatchEvent(event), repeatTimer ? SPEED : FIRST_DELAY);
      }
    };
    const handleInput = (value, ev) => {
      var _a2, _b, _c, _d;
      value = value.trim().replace(/。/g, ".");
      value = (_b = (_a2 = props.parser) == null ? void 0 : _a2.call(props, value)) != null ? _b : value;
      if (isNumber(Number(value)) || /^(\.|-)$/.test(value)) {
        _value.value = (_d = (_c = props.formatter) == null ? void 0 : _c.call(props, value)) != null ? _d : value;
        updateNumberStatus(valueNumber.value);
        emit("input", valueNumber.value, _value.value, ev);
        if (props.modelEvent === "input") {
          emit("update:modelValue", valueNumber.value);
          emit("change", valueNumber.value, ev);
        }
      }
    };
    const handleFocus = (ev) => {
      emit("focus", ev);
    };
    const handleChange = (value, ev) => {
      if (ev instanceof MouseEvent && !value) {
        return;
      }
      handleExceedRange();
      emit("change", valueNumber.value, ev);
    };
    const handleBlur = (ev) => {
      emit("blur", ev);
    };
    const handleClear = (ev) => {
      var _a2, _b;
      _value.value = "";
      emit("update:modelValue", void 0);
      emit("change", void 0, ev);
      (_b = (_a2 = eventHandlers.value) == null ? void 0 : _a2.onChange) == null ? void 0 : _b.call(_a2, ev);
      emit("clear", ev);
    };
    const keyDownHandler = getKeyDownHandler(/* @__PURE__ */ new Map([[KEYBOARD_KEY.ARROW_UP, (ev) => {
      ev.preventDefault();
      !props.readOnly && nextStep("plus", ev);
    }], [KEYBOARD_KEY.ARROW_DOWN, (ev) => {
      ev.preventDefault();
      !props.readOnly && nextStep("minus", ev);
    }]]));
    const onKeyDown = (event) => {
      emit("keydown", event);
      if (!event.defaultPrevented) {
        keyDownHandler(event);
      }
    };
    watch(() => props.modelValue, (value) => {
      if (value !== valueNumber.value) {
        _value.value = getStringValue(value);
        updateNumberStatus(value);
      }
    });
    const renderSuffix = () => {
      var _a2, _b, _c;
      if (props.readOnly) {
        return null;
      }
      return createVNode(Fragment, null, [slots.suffix && createVNode("div", {
        "class": `${prefixCls}-suffix`
      }, [(_a2 = slots.suffix) == null ? void 0 : _a2.call(slots)]), createVNode("div", {
        "class": `${prefixCls}-step`
      }, [createVNode("button", {
        "class": [`${prefixCls}-step-button`, {
          [`${prefixCls}-step-button-disabled`]: mergedDisabled.value || isMax.value
        }],
        "type": "button",
        "tabindex": "-1",
        "disabled": mergedDisabled.value || isMax.value,
        "onMousedown": (e) => handleStepButton(e, "plus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, [slots.plus ? (_b = slots.plus) == null ? void 0 : _b.call(slots) : createVNode(IconUp, null, null)]), createVNode("button", {
        "class": [`${prefixCls}-step-button`, {
          [`${prefixCls}-step-button-disabled`]: mergedDisabled.value || isMin.value
        }],
        "type": "button",
        "tabindex": "-1",
        "disabled": mergedDisabled.value || isMin.value,
        "onMousedown": (e) => handleStepButton(e, "minus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, [slots.minus ? (_c = slots.minus) == null ? void 0 : _c.call(slots) : createVNode(IconDown, null, null)])])]);
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-mode-${props.mode}`, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-readonly`]: props.readOnly
    }]);
    const renderPrependButton = () => {
      return createVNode(Button, {
        "size": mergedSize.value,
        "tabindex": "-1",
        "class": `${prefixCls}-step-button`,
        "disabled": mergedDisabled.value || isMin.value,
        "onMousedown": (ev) => handleStepButton(ev, "minus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, {
        icon: () => createVNode(IconMinus, null, null)
      });
    };
    const renderAppendButton = () => {
      return createVNode(Button, {
        "size": mergedSize.value,
        "tabindex": "-1",
        "class": `${prefixCls}-step-button`,
        "disabled": mergedDisabled.value || isMax.value,
        "onMousedown": (ev) => handleStepButton(ev, "plus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, {
        icon: () => createVNode(IconPlus, null, null)
      });
    };
    const render = () => {
      const _slots = props.mode === "embed" ? {
        prepend: slots.prepend,
        prefix: slots.prefix,
        suffix: props.hideButton ? slots.suffix : renderSuffix,
        append: slots.append
      } : {
        prepend: props.hideButton ? slots.prepend : renderPrependButton,
        prefix: slots.prefix,
        suffix: slots.suffix,
        append: props.hideButton ? slots.append : renderAppendButton
      };
      return createVNode(Input, {
        "key": `__arco__${props.mode}`,
        "ref": inputRef,
        "class": cls.value,
        "type": "text",
        "allowClear": props.allowClear,
        "size": mergedSize.value,
        "modelValue": _value.value,
        "placeholder": props.placeholder,
        "disabled": mergedDisabled.value,
        "readonly": props.readOnly,
        "error": props.error,
        "inputAttrs": {
          "role": "spinbutton",
          "aria-valuemax": props.max,
          "aria-valuemin": props.min,
          "aria-valuenow": _value.value,
          ...props.inputAttrs
        },
        "onInput": handleInput,
        "onFocus": handleFocus,
        "onBlur": handleBlur,
        "onClear": handleClear,
        "onChange": handleChange,
        "onKeydown": onKeyDown
      }, _slots);
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
export { _InputNumber as default };
