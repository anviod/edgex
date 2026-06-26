"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var context = require("../config-provider/context.js");
const useSize = (size, { defaultValue = "medium" } = {}) => {
  const configProviderCtx = vue.inject(context.configProviderInjectionKey, void 0);
  const mergedSize = vue.computed(
    () => {
      var _a, _b;
      return (_b = (_a = size == null ? void 0 : size.value) != null ? _a : configProviderCtx == null ? void 0 : configProviderCtx.size) != null ? _b : defaultValue;
    }
  );
  return {
    mergedSize
  };
};
exports.useSize = useSize;
