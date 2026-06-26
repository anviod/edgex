"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var vueUtils = require("../_utils/vue-utils.js");
const useFirstElement = () => {
  const children = {};
  const firstElement = vue.ref();
  const getFirstElement = () => {
    const element = vueUtils.getFirstElementFromChildren(children.value);
    if (element !== firstElement.value) {
      firstElement.value = element;
    }
  };
  vue.onMounted(() => getFirstElement());
  vue.onUpdated(() => getFirstElement());
  return {
    children,
    firstElement
  };
};
exports.useFirstElement = useFirstElement;
