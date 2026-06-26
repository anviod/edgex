import { toRef, ref, watch } from "vue";
import { isEqual } from "../_utils/is-equal.js";
const usePureProp = (props, name) => {
  const _value = toRef(props, name);
  const value = ref(_value.value);
  watch(_value, (cur, pre) => {
    if (!isEqual(cur, pre)) {
      value.value = cur;
    }
  });
  return value;
};
export { usePureProp };
