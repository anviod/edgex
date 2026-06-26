"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var keycode = require("../_utils/keycode.js");
const useInput = ({
  defaultValue,
  modelValue,
  emit,
  eventName = "input",
  updateEventName = "update:modelValue",
  eventHandlers
}) => {
  var _a;
  const inputRef = vue.ref();
  const _value = vue.ref((_a = defaultValue == null ? void 0 : defaultValue.value) != null ? _a : "");
  const _focused = vue.ref(false);
  const isComposition = vue.ref(false);
  const compositionValue = vue.ref("");
  let initialValue;
  const computedValue = vue.computed(() => {
    var _a2;
    return (_a2 = modelValue == null ? void 0 : modelValue.value) != null ? _a2 : _value.value;
  });
  const updateValue = (value, ev) => {
    _value.value = value;
    emit(updateEventName, value);
    emit(eventName, value, ev);
  };
  const handleInput = (ev) => {
    const { value } = ev.target;
    if (!isComposition.value) {
      updateValue(value, ev);
      vue.nextTick(() => {
        if (inputRef.value && computedValue.value !== inputRef.value.value) {
          inputRef.value.value = computedValue.value;
        }
      });
    }
  };
  const handleChange = (ev) => {
    if (eventName === "input" && computedValue.value !== initialValue) {
      initialValue = computedValue.value;
      emit("change", computedValue.value, ev);
    }
  };
  const handleComposition = (ev) => {
    var _a2;
    const { value } = ev.target;
    if (ev.type === "compositionend") {
      isComposition.value = false;
      compositionValue.value = "";
      updateValue(value, ev);
      vue.nextTick(() => {
        if (inputRef.value && computedValue.value !== inputRef.value.value) {
          inputRef.value.value = computedValue.value;
        }
      });
    } else {
      isComposition.value = true;
      compositionValue.value = computedValue.value + ((_a2 = ev.data) != null ? _a2 : "");
    }
  };
  const handleFocus = (ev) => {
    var _a2, _b;
    _focused.value = true;
    initialValue = computedValue.value;
    emit("focus", ev);
    (_b = (_a2 = eventHandlers == null ? void 0 : eventHandlers.value) == null ? void 0 : _a2.onFocus) == null ? void 0 : _b.call(_a2, ev);
  };
  const handleBlur = (ev) => {
    var _a2, _b;
    _focused.value = false;
    emit("blur", ev);
    (_b = (_a2 = eventHandlers == null ? void 0 : eventHandlers.value) == null ? void 0 : _a2.onBlur) == null ? void 0 : _b.call(_a2, ev);
    handleChange(ev);
  };
  const handleKeyDown = (ev) => {
    const keyCode = ev.key || ev.code;
    if (!isComposition.value && keyCode === keycode.Enter.key) {
      emit("pressEnter", ev);
      handleChange(ev);
    }
  };
  const handleMousedown = (ev) => {
    if (inputRef.value && ev.target !== inputRef.value) {
      ev.preventDefault();
      inputRef.value.focus();
    }
  };
  vue.watch(computedValue, (value) => {
    if (inputRef.value && value !== inputRef.value.value) {
      inputRef.value.value = value;
    }
  });
  return {
    inputRef,
    _value,
    _focused,
    isComposition,
    compositionValue,
    computedValue,
    handleInput,
    handleComposition,
    handleFocus,
    handleBlur,
    handleKeyDown,
    handleMousedown
  };
};
exports.useInput = useInput;
