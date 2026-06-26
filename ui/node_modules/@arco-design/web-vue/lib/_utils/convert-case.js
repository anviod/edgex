"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const toKebabCase = (string) => {
  return string.replace(/\B([A-Z])/g, "-$1").toLowerCase();
};
exports.toKebabCase = toKebabCase;
