"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const isEqualObject = (obj, other) => {
  if (!obj || !other) {
    return false;
  }
  if (obj.length !== other.length) {
    return false;
  }
  for (const key of Object.keys(obj)) {
    const result = isEqual(obj[key], other[key]);
    if (!result)
      return false;
  }
  return true;
};
const isEqualArray = (arr, other) => {
  if (!arr || !other) {
    return false;
  }
  const { length } = arr;
  if (length !== other.length) {
    return false;
  }
  for (let i = 0; i < length; i++) {
    const result = isEqual(arr[i], other[i]);
    if (!result)
      return false;
  }
  return true;
};
const isEqual = (a, b) => {
  const type = Object.prototype.toString.call(a);
  if (type !== Object.prototype.toString.call(b)) {
    return false;
  }
  if (type === "[object Object]") {
    return isEqualObject(
      a,
      b
    );
  }
  if (type === "[object Array]") {
    return isEqualArray(a, b);
  }
  if (type === "[object Function]") {
    if (a === b) {
      return true;
    }
    return a.toString() === b.toString();
  }
  return a === b;
};
exports.isEqual = isEqual;
exports.isEqualArray = isEqualArray;
exports.isEqualObject = isEqualObject;
