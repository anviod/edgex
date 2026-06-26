"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const omit = (object, path) => {
  const result = { ...object };
  for (const item of path) {
    if (item in result) {
      delete result[item];
    }
  }
  return result;
};
exports.omit = omit;
