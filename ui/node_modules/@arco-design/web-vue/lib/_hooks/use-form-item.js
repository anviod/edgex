"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var context = require("../form/context.js");
const useFormItem = ({
  size,
  disabled,
  error,
  uninject
} = {}) => {
  const formItemCtx = !uninject ? vue.inject(context.formItemInjectionKey, {}) : {};
  const mergedSize = vue.computed(() => {
    var _a;
    return (_a = size == null ? void 0 : size.value) != null ? _a : formItemCtx.size;
  });
  const mergedDisabled = vue.computed(
    () => (disabled == null ? void 0 : disabled.value) || formItemCtx.disabled
  );
  const mergedError = vue.computed(() => (error == null ? void 0 : error.value) || formItemCtx.error);
  const feedback = vue.toRef(formItemCtx, "feedback");
  const eventHandlers = vue.toRef(formItemCtx, "eventHandlers");
  return {
    formItemCtx,
    mergedSize,
    mergedDisabled,
    mergedError,
    feedback,
    eventHandlers
  };
};
exports.useFormItem = useFormItem;
