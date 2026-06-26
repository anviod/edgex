"use strict";
var vue = require("vue");
var is = require("../../_utils/is.js");
function isLabelValue(value) {
  return is.isObject(value);
}
function isValidKey(key) {
  return key !== void 0 && key !== null && key !== "";
}
function getKey(value) {
  return isLabelValue(value) ? value.value : value;
}
function getLabel(value) {
  return isLabelValue(value) ? value.label : void 0;
}
function isValidValue(value) {
  const key = getKey(value);
  return isValidKey(key);
}
function getKeys(value) {
  return value.map(getKey).filter(isValidKey);
}
function useSelectedState(props) {
  var _a;
  const {
    defaultValue,
    modelValue,
    key2TreeNode,
    multiple,
    treeCheckable,
    fallbackOption,
    fieldNames
  } = vue.toRefs(props);
  function normalizeValue(value) {
    const validValue = (is.isArray(value) ? value : [value]).filter(isValidValue);
    return (multiple == null ? void 0 : multiple.value) || (treeCheckable == null ? void 0 : treeCheckable.value) ? validValue : validValue.slice(0, 1);
  }
  function getLabelValues(value, originValue) {
    const res = [];
    const validValue = value ? value.filter(isValidValue) : [];
    if (validValue.length) {
      const originValueMap = /* @__PURE__ */ new Map();
      originValue == null ? void 0 : originValue.forEach((item) => {
        originValueMap.set(item.value, item);
      });
      validValue.forEach((item) => {
        var _a2, _b, _c, _d, _e;
        const key = getKey(item);
        const originValueItem = originValueMap.get(key);
        const node = key2TreeNode.value.get(key);
        let fallbackNodeData = null;
        const nodeDataTitle = ((_a2 = fieldNames == null ? void 0 : fieldNames.value) == null ? void 0 : _a2.title) || "title";
        if (!node) {
          const fallbackResult = is.isFunction(fallbackOption == null ? void 0 : fallbackOption.value) ? fallbackOption == null ? void 0 : fallbackOption.value(key) : fallbackOption == null ? void 0 : fallbackOption.value;
          if (fallbackResult === false) {
            return;
          }
          if (is.isObject(fallbackResult)) {
            fallbackNodeData = fallbackResult;
          }
        }
        res.push({
          ...isLabelValue(item) ? item : {},
          ...originValueItem || {},
          value: key,
          label: (_e = (_d = (_c = (_b = getLabel(item)) != null ? _b : node == null ? void 0 : node.title) != null ? _c : originValueItem == null ? void 0 : originValueItem.label) != null ? _d : fallbackNodeData == null ? void 0 : fallbackNodeData[nodeDataTitle]) != null ? _e : key
        });
      });
    }
    return res;
  }
  const computedModelValueKeys = vue.ref();
  const computedModelValue = vue.ref();
  vue.watchEffect(() => {
    var _a2;
    const isControlled = (modelValue == null ? void 0 : modelValue.value) !== void 0;
    const normalizeModelValue = normalizeValue((_a2 = modelValue == null ? void 0 : modelValue.value) != null ? _a2 : []);
    const modelValueKeys = getKeys(normalizeModelValue);
    computedModelValue.value = isControlled ? getLabelValues(modelValueKeys, getLabelValues(normalizeModelValue)) : void 0;
    computedModelValueKeys.value = isControlled ? modelValueKeys : void 0;
  });
  const normalizeDefaultValue = normalizeValue((_a = defaultValue == null ? void 0 : defaultValue.value) != null ? _a : []);
  const defaultKeys = getKeys(normalizeDefaultValue);
  const defaultLabelValues = getLabelValues(
    defaultKeys,
    getLabelValues(normalizeDefaultValue)
  );
  const localValueKeys = vue.ref(defaultKeys || []);
  const localValue = vue.ref(defaultLabelValues);
  vue.watch(localValueKeys, () => {
    localValue.value = getLabelValues(localValueKeys.value, defaultLabelValues);
  });
  vue.watch([computedModelValueKeys, computedModelValue], ([valueKeys, value]) => {
    localValueKeys.value = valueKeys || [];
    localValue.value = value || [];
  });
  const selectedKeys = vue.computed(
    () => {
      var _a2;
      return (_a2 = computedModelValueKeys.value) != null ? _a2 : localValueKeys.value;
    }
  );
  const selectedValue = vue.computed(
    () => {
      var _a2;
      return (_a2 = computedModelValue.value) != null ? _a2 : localValue.value;
    }
  );
  return {
    selectedKeys,
    selectedValue,
    setLocalSelectedKeys(keys) {
      localValueKeys.value = keys;
    },
    localSelectedKeys: localValueKeys,
    localSelectedValue: localValue
  };
}
module.exports = useSelectedState;
