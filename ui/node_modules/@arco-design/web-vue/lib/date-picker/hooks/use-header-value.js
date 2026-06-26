"use strict";
var vue = require("vue");
var date = require("../../_utils/date.js");
var usePanelSpan = require("./use-panel-span.js");
function useHeaderValue(props) {
  const { mode, value, defaultValue, selectedValue, format, onChange } = vue.toRefs(props);
  const computedMode = vue.computed(() => (mode == null ? void 0 : mode.value) || "date");
  const { span, superSpan } = usePanelSpan(
    vue.reactive({
      mode: computedMode
    })
  );
  const isSame = (current, target) => {
    const unit = computedMode.value === "date" || computedMode.value === "week" ? "M" : "y";
    return current.isSame(target, unit);
  };
  const computedValue = vue.computed(
    () => date.getDayjsValue(value == null ? void 0 : value.value, format.value)
  );
  const computedDefaultValue = vue.computed(
    () => date.getDayjsValue(defaultValue == null ? void 0 : defaultValue.value, format.value)
  );
  const localValue = vue.ref(computedDefaultValue.value || date.getNow());
  const headerValue = vue.computed(() => computedValue.value || localValue.value);
  const setLocalValue = (newVal) => {
    if (!newVal)
      return;
    localValue.value = newVal;
  };
  const setHeaderValue = (newVal, emitChange = true) => {
    var _a;
    if (!newVal)
      return;
    if (emitChange && !isSame(headerValue.value, newVal)) {
      (_a = onChange == null ? void 0 : onChange.value) == null ? void 0 : _a.call(onChange, newVal);
    }
    setLocalValue(newVal);
  };
  if (selectedValue == null ? void 0 : selectedValue.value) {
    setLocalValue(selectedValue.value);
  }
  vue.watch(
    () => selectedValue == null ? void 0 : selectedValue.value,
    (newVal) => {
      setHeaderValue(newVal);
    }
  );
  function getDefaultLocalValue() {
    return (selectedValue == null ? void 0 : selectedValue.value) || computedDefaultValue.value || date.getNow();
  }
  function resetHeaderValue(emitChange = true) {
    const defaultLocalValue = getDefaultLocalValue();
    if (emitChange) {
      setHeaderValue(defaultLocalValue);
    } else {
      setLocalValue(defaultLocalValue);
    }
  }
  const showSingleBtn = vue.computed(() => span.value !== superSpan.value);
  const headerOperations = vue.computed(() => ({
    onSuperPrev: () => {
      setHeaderValue(date.methods.subtract(headerValue.value, superSpan.value, "M"));
    },
    onPrev: showSingleBtn.value ? () => {
      setHeaderValue(date.methods.subtract(headerValue.value, span.value, "M"));
    } : void 0,
    onNext: showSingleBtn.value ? () => {
      setHeaderValue(date.methods.add(headerValue.value, span.value, "M"));
    } : void 0,
    onSuperNext: () => {
      setHeaderValue(date.methods.add(headerValue.value, superSpan.value, "M"));
    }
  }));
  return {
    headerValue,
    setHeaderValue,
    headerOperations,
    resetHeaderValue,
    getDefaultLocalValue
  };
}
module.exports = useHeaderValue;
