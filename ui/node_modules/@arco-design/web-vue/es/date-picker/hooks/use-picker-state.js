import { toRefs, computed, watch } from "vue";
import { getDayjsValue } from "../../_utils/date.js";
import { isUndefined } from "../../_utils/is.js";
import useState from "../../_hooks/use-state.js";
function usePickerState(props) {
  const { modelValue, defaultValue, format } = toRefs(props);
  const computedModelValue = computed(() => {
    return getDayjsValue(modelValue.value, format.value);
  });
  const computedDefaultValue = computed(() => {
    return getDayjsValue(defaultValue.value, format.value);
  });
  const [localValue, setLocalValue] = useState(
    !isUndefined(computedModelValue.value) ? computedModelValue.value : !isUndefined(computedDefaultValue.value) ? computedDefaultValue.value : void 0
  );
  watch(computedModelValue, () => {
    if (isUndefined(computedModelValue.value)) {
      setLocalValue(void 0);
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
export { usePickerState as default };
