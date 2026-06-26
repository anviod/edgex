"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("../_utils/is.js");
const getValueData = (value, fieldNames) => {
  const result = [];
  for (const item of value) {
    if (is.isObject(item)) {
      result.push({
        raw: item,
        value: item[fieldNames.value],
        label: item[fieldNames.label],
        closable: item[fieldNames.closable],
        tagProps: item[fieldNames.tagProps]
      });
    } else if (value || is.isNumber(value)) {
      const raw = {
        value: item,
        label: String(item),
        closable: true
      };
      result.push({
        raw,
        ...raw
      });
    }
  }
  return result;
};
exports.getValueData = getValueData;
