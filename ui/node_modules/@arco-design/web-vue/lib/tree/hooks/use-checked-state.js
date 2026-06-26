"use strict";
var vue = require("vue");
var checkUtils = require("../utils/check-utils.js");
function useCheckedState(props) {
  const {
    defaultCheckedKeys,
    checkedKeys: propCheckedKeys,
    key2TreeNode,
    checkStrictly,
    halfCheckedKeys,
    onlyCheckLeaf
  } = vue.toRefs(props);
  const isInitialized = vue.ref(false);
  const localCheckedKeys = vue.ref([]);
  const localIndeterminateKeys = vue.ref([]);
  const computedCheckedKeys = vue.ref();
  const computedIndeterminateKeys = vue.ref();
  const getStateByKeys = (keys) => {
    return checkUtils.getCheckedStateByInitKeys({
      initCheckedKeys: keys,
      key2TreeNode: key2TreeNode.value,
      checkStrictly: checkStrictly.value,
      onlyCheckLeaf: onlyCheckLeaf.value
    });
  };
  const init = (keys) => {
    const initState = getStateByKeys(keys);
    [localCheckedKeys.value, localIndeterminateKeys.value] = initState;
  };
  init(propCheckedKeys.value || (defaultCheckedKeys == null ? void 0 : defaultCheckedKeys.value) || []);
  vue.watchEffect(() => {
    if (propCheckedKeys.value) {
      [computedCheckedKeys.value, computedIndeterminateKeys.value] = getStateByKeys(propCheckedKeys.value);
    } else if (isInitialized.value) {
      computedCheckedKeys.value = void 0;
      computedIndeterminateKeys.value = void 0;
      localCheckedKeys.value = [];
      localIndeterminateKeys.value = [];
    }
    if (!isInitialized.value) {
      isInitialized.value = true;
    }
  });
  return {
    checkedKeys: vue.computed(
      () => computedCheckedKeys.value || localCheckedKeys.value
    ),
    indeterminateKeys: vue.computed(() => {
      if (checkStrictly.value && halfCheckedKeys.value) {
        return halfCheckedKeys.value;
      }
      return computedIndeterminateKeys.value || localIndeterminateKeys.value;
    }),
    setCheckedState(newCheckedKeys, newIndeterminateKeys, reinitialize = false) {
      if (reinitialize) {
        init(newCheckedKeys);
      } else {
        localCheckedKeys.value = newCheckedKeys;
        localIndeterminateKeys.value = newIndeterminateKeys;
      }
      return [localCheckedKeys.value, localIndeterminateKeys.value];
    }
  };
}
module.exports = useCheckedState;
