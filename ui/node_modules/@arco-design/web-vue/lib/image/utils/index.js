"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("../../_utils/is.js");
function normalizeImageSizeProp(size) {
  if (is.isUndefined(size))
    return void 0;
  if (!is.isNumber(size) && /^\d+(%)$/.test(size))
    return size;
  const num = parseInt(size, 10);
  return is.isNumber(num) ? `${num}px` : void 0;
}
exports.normalizeImageSizeProp = normalizeImageSizeProp;
