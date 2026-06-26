"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
var responsiveObserve = require("../../_utils/responsive-observe.js");
function isResponsiveValue(val) {
  return is.isObject(val);
}
function useResponsiveState(val, defaultVal, fallbackToXs = false) {
  const screens = vue.ref({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true
  });
  const result = vue.computed(() => {
    let res = defaultVal;
    if (isResponsiveValue(val.value)) {
      for (let i = 0; i < responsiveObserve.responsiveArray.length; i++) {
        const breakpoint = responsiveObserve.responsiveArray[i];
        if ((screens.value[breakpoint] || breakpoint === "xs" && fallbackToXs) && val.value[breakpoint] !== void 0) {
          res = val.value[breakpoint];
          break;
        }
      }
    } else {
      res = val.value;
    }
    return res;
  });
  let subscribeToken = "";
  vue.onMounted(() => {
    subscribeToken = responsiveObserve["default"].subscribe((screensVal) => {
      if (isResponsiveValue(val.value)) {
        screens.value = screensVal;
      }
    });
  });
  vue.onUnmounted(() => {
    if (subscribeToken) {
      responsiveObserve["default"].unsubscribe(subscribeToken);
    }
  });
  return result;
}
exports.useResponsiveState = useResponsiveState;
