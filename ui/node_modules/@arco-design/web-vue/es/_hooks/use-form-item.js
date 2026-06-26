import { inject, computed, toRef } from "vue";
import { formItemInjectionKey } from "../form/context.js";
const useFormItem = ({
  size,
  disabled,
  error,
  uninject
} = {}) => {
  const formItemCtx = !uninject ? inject(formItemInjectionKey, {}) : {};
  const mergedSize = computed(() => {
    var _a;
    return (_a = size == null ? void 0 : size.value) != null ? _a : formItemCtx.size;
  });
  const mergedDisabled = computed(
    () => (disabled == null ? void 0 : disabled.value) || formItemCtx.disabled
  );
  const mergedError = computed(() => (error == null ? void 0 : error.value) || formItemCtx.error);
  const feedback = toRef(formItemCtx, "feedback");
  const eventHandlers = toRef(formItemCtx, "eventHandlers");
  return {
    formItemCtx,
    mergedSize,
    mergedDisabled,
    mergedError,
    feedback,
    eventHandlers
  };
};
export { useFormItem };
