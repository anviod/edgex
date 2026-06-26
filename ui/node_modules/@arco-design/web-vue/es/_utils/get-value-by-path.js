import { isObject, isArray, isUndefined } from "./is.js";
const getValueByPath = (obj, path) => {
  if (!obj || !path) {
    return void 0;
  }
  path = path.replace(/\[(\w+)\]/g, ".$1");
  const keys = path.split(".");
  if (keys.length === 0) {
    return void 0;
  }
  let temp = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!isObject(temp) && !isArray(temp) || !keys[i]) {
      return void 0;
    }
    if (i !== keys.length - 1) {
      temp = temp[keys[i]];
    } else {
      return temp[keys[i]];
    }
  }
  return void 0;
};
const setValueByPath = (obj, path, value, { addPath } = {}) => {
  if (!obj || !path) {
    return;
  }
  path = path.replace(/\[(\w+)\]/g, ".$1");
  const keys = path.split(".");
  if (keys.length === 0) {
    return;
  }
  let temp = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!isObject(temp) && !isArray(temp) || !keys[i]) {
      return;
    }
    if (i !== keys.length - 1) {
      if (addPath && isUndefined(temp[keys[i]])) {
        temp[keys[i]] = {};
      }
      temp = temp[keys[i]];
    } else {
      temp[keys[i]] = value;
    }
  }
};
export { getValueByPath, setValueByPath };
