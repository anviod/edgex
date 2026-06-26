import { ref, onMounted, watch } from "vue";
import { isComponentInstance } from "../_utils/is.js";
const useComponentRef = (name) => {
  const componentRef = ref();
  const getElement = () => {
    if (isComponentInstance(componentRef.value)) {
      return componentRef.value.$refs[name];
    }
    return componentRef.value;
  };
  const elementRef = ref();
  onMounted(() => {
    elementRef.value = getElement();
  });
  watch([componentRef], () => {
    elementRef.value = getElement();
  });
  return {
    componentRef,
    elementRef
  };
};
export { useComponentRef };
