import { toRefs, computed } from "vue";
import { querySelector } from "../_utils/dom.js";
import { isString } from "../_utils/is.js";
function usePopupContainer(defaultPopupContainer, props) {
  const { popupContainer } = toRefs(props);
  const container = computed(
    () => (isString(popupContainer.value) ? querySelector(popupContainer.value) : popupContainer.value) || defaultPopupContainer
  );
  return container;
}
export { usePopupContainer as default };
