"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
var responsiveObserve = require("../../_utils/responsive-observe.js");
function useResponsiveValue(props) {
  const value = vue.computed(() => {
    const { val, key, xs, sm, md, lg, xl, xxl } = props.value;
    if (!xs && !sm && !md && !lg && !xl && !xxl) {
      return val;
    }
    const result = {};
    responsiveObserve.responsiveArray.forEach((breakpoint) => {
      const config = props.value[breakpoint];
      if (is.isNumber(config)) {
        result[breakpoint] = config;
      } else if (is.isObject(config) && is.isNumber(config[key])) {
        result[breakpoint] = config[key];
      }
    });
    return result;
  });
  return value;
}
exports.useResponsiveValue = useResponsiveValue;
