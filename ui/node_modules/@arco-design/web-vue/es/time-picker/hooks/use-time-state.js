import { toRefs, computed, watch } from "vue";
import { getDayjsValue } from "../../_utils/date.js";
import { isUndefined, isArray } from "../../_utils/is.js";
import useState from "../../_hooks/use-state.js";
function useTimeState(props) {
  const { modelValue, defaultValue, format, isRange } = toRefs(props);
  function getLocalEmptyValue() {
    return isRange.value ? [] : void 0;
  }
  function normalizeValue(time) {
    if (isUndefined(time)) {
      return void 0;
    }
    if (isRange.value) {
      return isArray(time) ? time : [time, void 0];
    }
    return time;
  }
  const computedModelValue = computed(() => {
    const time = normalizeValue(modelValue.value);
    return getDayjsValue(time, format.value);
  });
  const computedDefaultValue = computed(() => {
    const time = normalizeValue(defaultValue.value);
    return getDayjsValue(time, format.value);
  });
  const [localValue, setLocalValue] = useState(
    !isUndefined(computedModelValue.value) ? computedModelValue.value : !isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : getLocalEmptyValue()
  );
  watch(computedModelValue, () => {
    if (isUndefined(computedModelValue.value)) {
      setLocalValue(getLocalEmptyValue());
    }
  });
  const computedValue = computed(
    () => computedModelValue.value || localValue.value
  );
  const [panelValue, setPanelValue] = useState(computedValue.value);
  watch([computedValue], () => {
    setPanelValue(computedValue.value);
  });
  const [inputValue, setInputValue] = useState();
  watch([panelValue], () => {
    setInputValue(void 0);
  });
  return {
    computedValue,
    panelValue,
    inputValue,
    setValue: setLocalValue,
    setPanelValue,
    setInputValue
  };
}
export { useTimeState as default };
