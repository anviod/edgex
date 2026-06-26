"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../_utils/is.js");
const useComponentRef = (name) => {
  const componentRef = vue.ref();
  const getElement = () => {
    if (is.isComponentInstance(componentRef.value)) {
      return componentRef.value.$refs[name];
    }
    return componentRef.value;
  };
  const elementRef = vue.ref();
  vue.onMounted(() => {
    elementRef.value = getElement();
  });
  vue.watch([componentRef], () => {
    elementRef.value = getElement();
  });
  return {
    componentRef,
    elementRef
  };
};
exports.useComponentRef = useComponentRef;
