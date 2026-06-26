import { toRefs, computed, reactive, ref, watch } from "vue";
import { getDayjsValue, getNow, methods } from "../../_utils/date.js";
import usePanelSpan from "./use-panel-span.js";
function useHeaderValue(props) {
  const { mode, value, defaultValue, selectedValue, format, onChange } = toRefs(props);
  const computedMode = computed(() => (mode == null ? void 0 : mode.value) || "date");
  const { span, superSpan } = usePanelSpan(
    reactive({
      mode: computedMode
    })
  );
  const isSame = (current, target) => {
    const unit = computedMode.value === "date" || computedMode.value === "week" ? "M" : "y";
    return current.isSame(target, unit);
  };
  const computedValue = computed(
    () => getDayjsValue(value == null ? void 0 : value.value, format.value)
  );
  const computedDefaultValue = computed(
    () => getDayjsValue(defaultValue == null ? void 0 : defaultValue.value, format.value)
  );
  const localValue = ref(computedDefaultValue.value || getNow());
  const headerValue = computed(() => computedValue.value || localValue.value);
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
  watch(
    () => selectedValue == null ? void 0 : selectedValue.value,
    (newVal) => {
      setHeaderValue(newVal);
    }
  );
  function getDefaultLocalValue() {
    return (selectedValue == null ? void 0 : selectedValue.value) || computedDefaultValue.value || getNow();
  }
  function resetHeaderValue(emitChange = true) {
    const defaultLocalValue = getDefaultLocalValue();
    if (emitChange) {
      setHeaderValue(defaultLocalValue);
    } else {
      setLocalValue(defaultLocalValue);
    }
  }
  const showSingleBtn = computed(() => span.value !== superSpan.value);
  const headerOperations = computed(() => ({
    onSuperPrev: () => {
      setHeaderValue(methods.subtract(headerValue.value, superSpan.value, "M"));
    },
    onPrev: showSingleBtn.value ? () => {
      setHeaderValue(methods.subtract(headerValue.value, span.value, "M"));
    } : void 0,
    onNext: showSingleBtn.value ? () => {
      setHeaderValue(methods.add(headerValue.value, span.value, "M"));
    } : void 0,
    onSuperNext: () => {
      setHeaderValue(methods.add(headerValue.value, superSpan.value, "M"));
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
export { useHeaderValue as default };
