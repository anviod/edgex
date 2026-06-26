import { ref, onMounted, onUpdated } from "vue";
import { getFirstElementFromChildren } from "../_utils/vue-utils.js";
const useFirstElement = () => {
  const children = {};
  const firstElement = ref();
  const getFirstElement = () => {
    const element = getFirstElementFromChildren(children.value);
    if (element !== firstElement.value) {
      firstElement.value = element;
    }
  };
  onMounted(() => getFirstElement());
  onUpdated(() => getFirstElement());
  return {
    children,
    firstElement
  };
};
export { useFirstElement };
