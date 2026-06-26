"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../_utils/is.js");
const useScrollbar = (scrollbar) => {
  const displayScrollbar = vue.computed(() => Boolean(scrollbar.value));
  const scrollbarProps = vue.computed(() => {
    if (!scrollbar.value)
      return void 0;
    return {
      type: "embed",
      ...is.isBoolean(scrollbar.value) ? void 0 : scrollbar.value
    };
  });
  return {
    displayScrollbar,
    scrollbarProps
  };
};
exports.useScrollbar = useScrollbar;
