"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("./is.js");
function toArray(val) {
  return is.isArray(val) ? val : [val];
}
exports.toArray = toArray;
