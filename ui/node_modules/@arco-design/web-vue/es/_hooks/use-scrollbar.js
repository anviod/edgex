import { computed } from "vue";
import { isBoolean } from "../_utils/is.js";
const useScrollbar = (scrollbar) => {
  const displayScrollbar = computed(() => Boolean(scrollbar.value));
  const scrollbarProps = computed(() => {
    if (!scrollbar.value)
      return void 0;
    return {
      type: "embed",
      ...isBoolean(scrollbar.value) ? void 0 : scrollbar.value
    };
  });
  return {
    displayScrollbar,
    scrollbarProps
  };
};
export { useScrollbar };
