"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var vueUtils = require("../_utils/vue-utils.js");
const useChildrenComponents = (name) => {
  const children = {};
  const components = vue.ref([]);
  const getComponents = () => {
    if (children.value) {
      const _components = vueUtils.getComponentsFromChildren(children.value, name);
      if (_components.length !== components.value.length || _components.toString() !== components.value.toString()) {
        components.value = _components;
      }
    }
  };
  vue.onMounted(() => getComponents());
  vue.onUpdated(() => getComponents());
  return {
    children,
    components
  };
};
exports.useChildrenComponents = useChildrenComponents;
