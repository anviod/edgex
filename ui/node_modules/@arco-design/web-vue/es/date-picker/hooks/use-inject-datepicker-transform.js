import { inject } from "vue";
import { PickerInjectionKey } from "../context.js";
function useDatePickerTransform() {
  const { datePickerT } = inject(PickerInjectionKey) || {};
  return datePickerT || ((key, ...args) => key);
}
export { useDatePickerTransform as default };
