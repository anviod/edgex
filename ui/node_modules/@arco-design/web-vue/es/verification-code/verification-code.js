import { defineComponent, ref, computed, watch, createVNode, Fragment } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Input from "../input/index.js";
import { isExist, isFunction, isString } from "../_utils/is.js";
import { Backspace, ArrowLeft, ArrowRight } from "../_utils/keycode.js";
var _VerificationCode = defineComponent({
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
    "input": (inputValue, index, ev) => true
  },
  setup(props, {
    emit
  }) {
    const prefixCls = getPrefixCls("verification-code");
    const prefixInputCls = getPrefixCls("input");
    const inputRefList = ref([]);
    const mergedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : props.defaultValue;
    });
    const type = computed(() => props.masked ? "password" : "text");
    const inputCls = computed(() => [prefixInputCls, {
      [`${prefixInputCls}-size-${props.size}`]: props.size
    }]);
    const filledValue = computed(() => {
      const newVal = String(mergedValue.value).split("");
      return new Array(props.length).fill("").map((_, index) => {
        return isExist(newVal[index]) ? String(newVal[index]) : "";
      });
    });
    const innerValue = ref(filledValue.value);
    watch(mergedValue, () => {
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
    const handleFocus = (index) => inputRefList == null ? void 0 : inputRefList.value[index].focus();
    const focusFirstEmptyInput = (index) => {
      if (isExist(index) && innerValue.value[index]) {
        return;
      }
      for (let i = 0; i < innerValue.value.length; i++) {
        if (!innerValue.value[i]) {
          handleFocus(i);
          break;
        }
      }
    };
    const handlePaste = (e, index) => {
      e.preventDefault();
      const {
        clipboardData
      } = e;
      const text = clipboardData == null ? void 0 : clipboardData.getData("text");
      if (!text)
        return;
      text.split("").forEach((char, i) => {
        if (index + i >= props.length)
          return;
        if (isFunction(props.formatter)) {
          const result = props.formatter(char, index + i, innerValue.value.join(""));
          if (result === false) {
            index -= 1;
            return;
          }
          if (isString(result)) {
            char = result.charAt(0);
          }
        }
        innerValue.value[index + i] = char;
      });
      updateValue();
    };
    const handleKeydown = (index, e) => {
      const keyCode = e.code || e.key;
      if (keyCode === Backspace.code && !innerValue.value[index]) {
        e.preventDefault();
        innerValue.value[Math.max(index - 1, 0)] = "";
        updateValue();
      } else if (keyCode === ArrowLeft.code && index > 0) {
        e.preventDefault();
        handleFocus(index - 1);
      } else if (keyCode === ArrowRight.code && innerValue.value[index] && index < props.length - 1) {
        e.preventDefault();
        handleFocus(index + 1);
      }
    };
    const handleInput = (index, value, event) => {
      let char = (value || "").trim().charAt(value.length - 1);
      emit("input", char, index, event);
      if (isFunction(props.formatter)) {
        const result = props.formatter(char, index, innerValue.value.join(""));
        if (result === false)
          return;
        if (isString(result)) {
          char = result.charAt(0);
        }
      }
      innerValue.value[index] = char;
      updateValue();
    };
    return () => {
      return createVNode("div", {
        "class": prefixCls
      }, [innerValue.value.map((c, i) => {
        var _a;
        return createVNode(Fragment, null, [createVNode(Input, {
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
export { _VerificationCode as default };
