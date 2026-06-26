"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var isEqual = require("../_utils/is-equal.js");
const usePureProp = (props, name) => {
  const _value = vue.toRef(props, name);
  const value = vue.ref(_value.value);
  vue.watch(_value, (cur, pre) => {
    if (!isEqual.isEqual(cur, pre)) {
      value.value = cur;
    }
  });
  return value;
};
exports.usePureProp = usePureProp;
