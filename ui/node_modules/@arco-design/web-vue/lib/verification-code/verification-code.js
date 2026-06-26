"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../input/index.js");
var is = require("../_utils/is.js");
var keycode = require("../_utils/keycode.js");
var _VerificationCode = vue.defineComponent({
  name: "VerificationCode",
  props: {
    modelValue: String,
    defaultValue: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 6
    },
    size: {
      type: String
    },
    disabled: Boolean,
    masked: Boolean,
    readonly: Boolean,
    error: {
      type: Boolean,
      default: false
    },
    separator: {
      type: Function
    },
    formatter: {
      type: Function
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true,
    "finish": (value) => true,
    "input": (inputValue, index2, ev) => true
  },
  setup(props, {
    emit
  }) {
    const prefixCls = globalConfig.getPrefixCls("verification-code");
    const prefixInputCls = globalConfig.getPrefixCls("input");
    const inputRefList = vue.ref([]);
    const mergedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : props.defaultValue;
    });
    const type = vue.computed(() => props.masked ? "password" : "text");
    const inputCls = vue.computed(() => [prefixInputCls, {
      [`${prefixInputCls}-size-${props.size}`]: props.size
    }]);
    const filledValue = vue.computed(() => {
      const newVal = String(mergedValue.value).split("");
      return new Array(props.length).fill("").map((_, index2) => {
        return is.isExist(newVal[index2]) ? String(newVal[index2]) : "";
      });
    });
    const innerValue = vue.ref(filledValue.value);
    vue.watch(mergedValue, () => {
      innerValue.value = filledValue.value;
    });
    const updateValue = () => {
      const value = innerValue.value.join("").trim();
      emit("update:modelValue", value);
      emit("change", value);
      if (value.length === props.length) {
        emit("finish", value);
      }
      focusFirstEmptyInput();
    };
    const handleFocus = (index2) => inputRefList == null ? void 0 : inputRefList.value[index2].focus();
    const focusFirstEmptyInput = (index2) => {
      if (is.isExist(index2) && innerValue.value[index2]) {
        return;
      }
      for (let i = 0; i < innerValue.value.length; i++) {
        if (!innerValue.value[i]) {
          handleFocus(i);
          break;
        }
      }
    };
    const handlePaste = (e, index2) => {
      e.preventDefault();
      const {
        clipboardData
      } = e;
      const text = clipboardData == null ? void 0 : clipboardData.getData("text");
      if (!text)
        return;
      text.split("").forEach((char, i) => {
        if (index2 + i >= props.length)
          return;
        if (is.isFunction(props.formatter)) {
          const result = props.formatter(char, index2 + i, innerValue.value.join(""));
          if (result === false) {
            index2 -= 1;
            return;
          }
          if (is.isString(result)) {
            char = result.charAt(0);
          }
        }
        innerValue.value[index2 + i] = char;
      });
      updateValue();
    };
    const handleKeydown = (index2, e) => {
      const keyCode = e.code || e.key;
      if (keyCode === keycode.Backspace.code && !innerValue.value[index2]) {
        e.preventDefault();
        innerValue.value[Math.max(index2 - 1, 0)] = "";
        updateValue();
      } else if (keyCode === keycode.ArrowLeft.code && index2 > 0) {
        e.preventDefault();
        handleFocus(index2 - 1);
      } else if (keyCode === keycode.ArrowRight.code && innerValue.value[index2] && index2 < props.length - 1) {
        e.preventDefault();
        handleFocus(index2 + 1);
      }
    };
    const handleInput = (index2, value, event) => {
      let char = (value || "").trim().charAt(value.length - 1);
      emit("input", char, index2, event);
      if (is.isFunction(props.formatter)) {
        const result = props.formatter(char, index2, innerValue.value.join(""));
        if (result === false)
          return;
        if (is.isString(result)) {
          char = result.charAt(0);
        }
      }
      innerValue.value[index2] = char;
      updateValue();
    };
    return () => {
      return vue.createVNode("div", {
        "class": prefixCls
      }, [innerValue.value.map((c, i) => {
        var _a;
        return vue.createVNode(vue.Fragment, null, [vue.createVNode(index["default"], {
          "key": i,
          "ref": (el) => inputRefList.value[i] = el,
          "type": type.value,
          "class": inputCls.value,
          "modelValue": c,
          "size": props.size,
          "error": props.error,
          "disabled": props.disabled,
          "readonly": props.readonly,
          "onFocus": () => focusFirstEmptyInput(i),
          "onInput": (v, e) => handleInput(i, v, e),
          "onKeydown": (e) => handleKeydown(i, e),
          "onPaste": (e) => handlePaste(e, i)
        }, null), (_a = props.separator) == null ? void 0 : _a.call(props, i, c)]);
      })]);
    };
  }
});
module.exports = _VerificationCode;
