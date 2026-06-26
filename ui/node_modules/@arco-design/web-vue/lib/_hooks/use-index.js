"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../_utils/is.js");
const useIndex = ({
  itemRef,
  selector,
  index,
  parentClassName
}) => {
  const _index = vue.ref(-1);
  const computedIndex = vue.computed(() => {
    var _a;
    return (_a = index == null ? void 0 : index.value) != null ? _a : _index.value;
  });
  const parent = vue.ref();
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
    if (is.isUndefined(index == null ? void 0 : index.value) && parent.value && itemRef.value) {
      const index2 = Array.from(parent.value.querySelectorAll(selector)).indexOf(
        itemRef.value
      );
      if (index2 !== _index.value) {
        _index.value = index2;
      }
    }
  };
  vue.watch(itemRef, () => {
    if (itemRef.value && !parent.value) {
      parent.value = getParent();
    }
  });
  vue.onMounted(() => {
    if (itemRef.value) {
      parent.value = getParent();
    }
    getIndex();
  });
  vue.onUpdated(() => getIndex());
  return {
    computedIndex
  };
};
exports.useIndex = useIndex;
