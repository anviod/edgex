"use strict";
var vue = require("vue");
var NP = require("number-precision");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var index$1 = require("../icon/icon-up/index.js");
var index$2 = require("../icon/icon-down/index.js");
var index$5 = require("../icon/icon-plus/index.js");
var index$4 = require("../icon/icon-minus/index.js");
var index$3 = require("../button/index.js");
var index = require("../input/index.js");
var useFormItem = require("../_hooks/use-form-item.js");
var useSize = require("../_hooks/use-size.js");
var keyboard = require("../_utils/keyboard.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const FIRST_DELAY = 800;
const SPEED = 150;
NP__default["default"].enableBoundaryChecking(false);
var _InputNumber = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("input-number");
    const inputRef = vue.ref();
    const {
      mergedSize: _mergedSize,
      mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      disabled
    });
    const {
      mergedSize
    } = useSize.useSize(_mergedSize);
    const mergedPrecision = vue.computed(() => {
      if (is.isNumber(props.precision)) {
        const decimal = `${props.step}`.split(".")[1];
        const stepPrecision = decimal && decimal.length || 0;
        return Math.max(stepPrecision, props.precision);
      }
      return void 0;
    });
    const getStringValue = (number) => {
      var _a2, _b;
      if (!is.isNumber(number)) {
        return "";
      }
      const numString = mergedPrecision.value ? number.toFixed(mergedPrecision.value) : String(number);
      return (_b = (_a2 = props.formatter) == null ? void 0 : _a2.call(props, numString)) != null ? _b : numString;
    };
    const _value = vue.ref(getStringValue((_a = props.modelValue) != null ? _a : props.defaultValue));
    const valueNumber = vue.computed(() => {
      var _a2, _b;
      if (!_value.value) {
        return void 0;
      }
      const number = Number((_b = (_a2 = props.parser) == null ? void 0 : _a2.call(props, _value.value)) != null ? _b : _value.value);
      return Number.isNaN(number) ? void 0 : number;
    });
    const isMin = vue.ref(is.isNumber(valueNumber.value) && valueNumber.value <= props.min);
    const isMax = vue.ref(is.isNumber(valueNumber.value) && valueNumber.value >= props.max);
    let repeatTimer = 0;
    const clearRepeatTimer = () => {
      if (repeatTimer) {
        window.clearTimeout(repeatTimer);
        repeatTimer = 0;
      }
    };
    const getLegalValue = (value) => {
      if (is.isUndefined(value)) {
        return void 0;
      }
      if (is.isNumber(props.min) && value < props.min) {
        value = props.min;
      }
      if (is.isNumber(props.max) && value > props.max) {
        value = props.max;
      }
      return is.isNumber(mergedPrecision.value) ? NP__default["default"].round(value, mergedPrecision.value) : value;
    };
    const updateNumberStatus = (number) => {
      let _isMin = false;
      let _isMax = false;
      if (is.isNumber(number)) {
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
    vue.watch(() => [props.max, props.min], () => {
      handleExceedRange();
      updateNumberStatus(valueNumber.value);
    });
    const nextStep = (method, event) => {
      if (mergedDisabled.value || method === "plus" && isMax.value || method === "minus" && isMin.value) {
        return;
      }
      let nextValue;
      if (is.isNumber(valueNumber.value)) {
        nextValue = getLegalValue(NP__default["default"][method](valueNumber.value, props.step));
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
      if (is.isNumber(Number(value)) || /^(\.|-)$/.test(value)) {
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
    const keyDownHandler = keyboard.getKeyDownHandler(/* @__PURE__ */ new Map([[keyboard.KEYBOARD_KEY.ARROW_UP, (ev) => {
      ev.preventDefault();
      !props.readOnly && nextStep("plus", ev);
    }], [keyboard.KEYBOARD_KEY.ARROW_DOWN, (ev) => {
      ev.preventDefault();
      !props.readOnly && nextStep("minus", ev);
    }]]));
    const onKeyDown = (event) => {
      emit("keydown", event);
      if (!event.defaultPrevented) {
        keyDownHandler(event);
      }
    };
    vue.watch(() => props.modelValue, (value) => {
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
      return vue.createVNode(vue.Fragment, null, [slots.suffix && vue.createVNode("div", {
        "class": `${prefixCls}-suffix`
      }, [(_a2 = slots.suffix) == null ? void 0 : _a2.call(slots)]), vue.createVNode("div", {
        "class": `${prefixCls}-step`
      }, [vue.createVNode("button", {
        "class": [`${prefixCls}-step-button`, {
          [`${prefixCls}-step-button-disabled`]: mergedDisabled.value || isMax.value
        }],
        "type": "button",
        "tabindex": "-1",
        "disabled": mergedDisabled.value || isMax.value,
        "onMousedown": (e) => handleStepButton(e, "plus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, [slots.plus ? (_b = slots.plus) == null ? void 0 : _b.call(slots) : vue.createVNode(index$1, null, null)]), vue.createVNode("button", {
        "class": [`${prefixCls}-step-button`, {
          [`${prefixCls}-step-button-disabled`]: mergedDisabled.value || isMin.value
        }],
        "type": "button",
        "tabindex": "-1",
        "disabled": mergedDisabled.value || isMin.value,
        "onMousedown": (e) => handleStepButton(e, "minus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, [slots.minus ? (_c = slots.minus) == null ? void 0 : _c.call(slots) : vue.createVNode(index$2, null, null)])])]);
    };
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-mode-${props.mode}`, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-readonly`]: props.readOnly
    }]);
    const renderPrependButton = () => {
      return vue.createVNode(index$3["default"], {
        "size": mergedSize.value,
        "tabindex": "-1",
        "class": `${prefixCls}-step-button`,
        "disabled": mergedDisabled.value || isMin.value,
        "onMousedown": (ev) => handleStepButton(ev, "minus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, {
        icon: () => vue.createVNode(index$4, null, null)
      });
    };
    const renderAppendButton = () => {
      return vue.createVNode(index$3["default"], {
        "size": mergedSize.value,
        "tabindex": "-1",
        "class": `${prefixCls}-step-button`,
        "disabled": mergedDisabled.value || isMax.value,
        "onMousedown": (ev) => handleStepButton(ev, "plus", true),
        "onMouseup": clearRepeatTimer,
        "onMouseleave": clearRepeatTimer
      }, {
        icon: () => vue.createVNode(index$5, null, null)
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
      return vue.createVNode(index["default"], {
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
module.exports = _InputNumber;
