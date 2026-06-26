"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var NP = require("number-precision");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
const getOffsetPercent = (value, [min, max]) => {
  const percent = Math.max((value - min) / (max - min), 0);
  return `${NP__default["default"].round(percent * 100, 2)}%`;
};
const getPositionStyle = (offset, direction) => {
  return direction === "vertical" ? { bottom: offset } : { left: offset };
};
exports.getOffsetPercent = getOffsetPercent;
exports.getPositionStyle = getPositionStyle;
