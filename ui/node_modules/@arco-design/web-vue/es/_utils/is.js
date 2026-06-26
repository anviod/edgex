const opt = Object.prototype.toString;
function isArray(obj) {
  return opt.call(obj) === "[object Array]";
}
function isNull(obj) {
  return opt.call(obj) === "[object Null]";
}
function isBoolean(obj) {
  return opt.call(obj) === "[object Boolean]";
}
function isObject(obj) {
  return opt.call(obj) === "[object Object]";
}
const isPromise = (obj) => {
  return opt.call(obj) === "[object Promise]";
};
function isString(obj) {
  return opt.call(obj) === "[object String]";
}
function isNumber(obj) {
  return opt.call(obj) === "[object Number]" && obj === obj;
}
function isUndefined(obj) {
  return obj === void 0;
}
function isFunction(obj) {
  return typeof obj === "function";
}
function isEmptyObject(obj) {
  return isObject(obj) && Object.keys(obj).length === 0;
}
function isExist(obj) {
  return obj || obj === 0;
}
function isWindow(el) {
  return el === window;
}
const isComponentInstance = (value) => {
  return (value == null ? void 0 : value.$) !== void 0;
};
const isQuarter = (fromat) => {
  return /\[Q]Q/.test(fromat);
};
function isDayjs(time) {
  return isObject(time) && "$y" in time && "$M" in time && "$D" in time && "$d" in time && "$H" in time && "$m" in time && "$s" in time;
}
export { isArray, isBoolean, isComponentInstance, isDayjs, isEmptyObject, isExist, isFunction, isNull, isNumber, isObject, isPromise, isQuarter, isString, isUndefined, isWindow };
