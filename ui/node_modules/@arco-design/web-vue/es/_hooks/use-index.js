import { ref, computed, watch, onMounted, onUpdated } from "vue";
import { isUndefined } from "../_utils/is.js";
const useIndex = ({
  itemRef,
  selector,
  index,
  parentClassName
}) => {
  const _index = ref(-1);
  const computedIndex = computed(() => {
    var _a;
    return (_a = index == null ? void 0 : index.value) != null ? _a : _index.value;
  });
  const parent = ref();
  const getParent = () => {
    var _a, _b, _c;
    let parent2 = (_b = (_a = itemRef.value) == null ? void 0 : _a.parentElement) != null ? _b : void 0;
    if (parentClassName) {
      while (parent2 && !parent2.className.includes(parentClassName)) {
        parent2 = (_c = parent2.parentElement) != null ? _c : void 0;
      }
    }
    return parent2;
  };
  const getIndex = () => {
    if (isUndefined(index == null ? void 0 : index.value) && parent.value && itemRef.value) {
      const index2 = Array.from(parent.value.querySelectorAll(selector)).indexOf(
        itemRef.value
      );
      if (index2 !== _index.value) {
        _index.value = index2;
      }
    }
  };
  watch(itemRef, () => {
    if (itemRef.value && !parent.value) {
      parent.value = getParent();
    }
  });
  onMounted(() => {
    if (itemRef.value) {
      parent.value = getParent();
    }
    getIndex();
  });
  onUpdated(() => getIndex());
  return {
    computedIndex
  };
};
export { useIndex };
