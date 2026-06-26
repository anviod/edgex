"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const getLegalPage = (page, { min, max }) => {
  if (page < min) {
    return min;
  }
  if (page > max) {
    return max;
  }
  return page;
};
exports.getLegalPage = getLegalPage;
