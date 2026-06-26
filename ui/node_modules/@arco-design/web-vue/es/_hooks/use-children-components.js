import { ref, onMounted, onUpdated } from "vue";
import { getComponentsFromChildren } from "../_utils/vue-utils.js";
const useChildrenComponents = (name) => {
  const children = {};
  const components = ref([]);
  const getComponents = () => {
    if (children.value) {
      const _components = getComponentsFromChildren(children.value, name);
      if (_components.length !== components.value.length || _components.toString() !== components.value.toString()) {
        components.value = _components;
      }
    }
  };
  onMounted(() => getComponents());
  onUpdated(() => getComponents());
  return {
    children,
    components
  };
};
export { useChildrenComponents };
