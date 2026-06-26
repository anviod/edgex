import { inject, computed } from "vue";
import { configProviderInjectionKey } from "../config-provider/context.js";
const useSize = (size, { defaultValue = "medium" } = {}) => {
  const configProviderCtx = inject(configProviderInjectionKey, void 0);
  const mergedSize = computed(
    () => {
      var _a, _b;
      return (_b = (_a = size == null ? void 0 : size.value) != null ? _a : configProviderCtx == null ? void 0 : configProviderCtx.size) != null ? _b : defaultValue;
    }
  );
  return {
    mergedSize
  };
};
export { useSize };
