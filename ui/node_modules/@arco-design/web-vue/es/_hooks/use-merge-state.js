import { toRefs, watch, computed } from "vue";
import { isUndefined } from "../_utils/is.js";
import useState from "./use-state.js";
function useMergeState(defaultValue, props) {
  const { value } = toRefs(props);
  const [localValue, setLocalValue] = useState(
    !isUndefined(value.value) ? value.value : defaultValue
  );
  watch(value, (newVal) => {
    isUndefined(newVal) && setLocalValue(void 0);
  });
  const mergeValue = computed(
    () => !isUndefined(value.value) ? value.value : localValue.value
  );
  return [mergeValue, setLocalValue, localValue];
}
export { useMergeState as default };
