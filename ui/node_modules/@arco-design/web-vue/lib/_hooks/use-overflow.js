"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var dom = require("../_utils/dom.js");
const useOverflow = (elementRef) => {
  const isSetOverflow = vue.ref(false);
  const originStyle = {
    overflow: "",
    width: "",
    boxSizing: ""
  };
  const setOverflowHidden = () => {
    if (elementRef.value) {
      const element = elementRef.value;
      if (!isSetOverflow.value && element.style.overflow !== "hidden") {
        const scrollBarWidth = dom.getScrollBarWidth(element);
        if (scrollBarWidth > 0 || dom.isScroll(element)) {
          originStyle.overflow = element.style.overflow;
          originStyle.width = element.style.width;
          originStyle.boxSizing = element.style.boxSizing;
          element.style.overflow = "hidden";
          element.style.width = `${element.offsetWidth - scrollBarWidth}px`;
          element.style.boxSizing = "border-box";
          isSetOverflow.value = true;
        }
      }
    }
  };
  const resetOverflow = () => {
    if (elementRef.value && isSetOverflow.value) {
      const element = elementRef.value;
      element.style.overflow = originStyle.overflow;
      element.style.width = originStyle.width;
      element.style.boxSizing = originStyle.boxSizing;
      isSetOverflow.value = false;
    }
  };
  return {
    setOverflowHidden,
    resetOverflow
  };
};
exports.useOverflow = useOverflow;
