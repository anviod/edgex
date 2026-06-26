import { toRefs, computed, watch } from "vue";
import { normalizeRangeValue } from "../utils/index.js";
import { getDayjsValue } from "../../_utils/date.js";
import { isUndefined } from "../../_utils/is.js";
import useState from "../../_hooks/use-state.js";
function useRangePickerState(props) {
  const { modelValue, defaultValue, format } = toRefs(props);
  const computedModelValue = computed(() => {
    return getDayjsValue(normalizeRangeValue(modelValue.value), format.value);
  });
  const computedDefaultValue = computed(() => {
    return getDayjsValue(normalizeRangeValue(defaultValue.value), format.value);
  });
  const [localValue, setLocalValue] = useState(
    !isUndefined(computedModelValue.value) ? computedModelValue.value : !isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : []
  );
  watch(computedModelValue, () => {
    if (isUndefined(computedModelValue.value)) {
      setLocalValue([]);
    }
  });
  const mergeValue = computed(
    () => computedModelValue.value || localValue.value
  );
  return {
    value: mergeValue,
    setValue: setLocalValue
  };
}
export { useRangePickerState as default };
