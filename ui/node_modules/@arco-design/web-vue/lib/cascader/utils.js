"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("../_utils/is.js");
const getOptionInfos = (options, {
  optionMap,
  leafOptionMap,
  leafOptionSet,
  leafOptionValueMap,
  totalLevel: innerLevel,
  checkStrictly,
  enabledLazyLoad,
  lazyLoadOptions,
  valueKey,
  fieldNames
}) => {
  let totalLevel = 0;
  const travelOptions = (options2, parent, level) => {
    var _a;
    const parentPath = (_a = parent == null ? void 0 : parent.path) != null ? _a : [];
    totalLevel = Math.max(totalLevel, level != null ? level : 1);
    return options2.map((item, index) => {
      var _a2;
      const value = item[fieldNames.value];
      const data = {
        raw: item,
        value,
        label: (_a2 = item[fieldNames.label]) != null ? _a2 : String(value),
        disabled: Boolean(item[fieldNames.disabled]),
        selectionDisabled: false,
        render: item[fieldNames.render],
        tagProps: item[fieldNames.tagProps],
        isLeaf: item[fieldNames.isLeaf],
        level: parentPath.length,
        index,
        key: "",
        valueKey: String(is.isObject(value) ? value[valueKey.value] : value),
        parent,
        path: [],
        pathValue: []
      };
      const path = parentPath.concat(data);
      const pathValue = [];
      const key = path.map((item2) => {
        pathValue.push(item2.value);
        return item2.valueKey;
      }).join("-");
      data.path = path;
      data.pathValue = pathValue;
      data.key = key;
      if (item[fieldNames.children]) {
        data.isLeaf = false;
        data.children = travelOptions(
          item[fieldNames.children],
          data,
          (level != null ? level : 1) + 1
        );
      } else if (enabledLazyLoad && !data.isLeaf) {
        data.isLeaf = false;
        if (lazyLoadOptions[key]) {
          data.children = travelOptions(
            lazyLoadOptions[key],
            data,
            (level != null ? level : 1) + 1
          );
        }
      } else {
        data.isLeaf = true;
      }
      if (data.children && !data.disabled) {
        data.totalLeafOptions = data.children.reduce((pre, item2) => {
          if (is.isNumber(item2.totalLeafOptions)) {
            return pre + item2.totalLeafOptions;
          }
          if (item2.disabled || item2.selectionDisabled) {
            return pre;
          }
          return pre + (item2.isLeaf ? 1 : 0);
        }, 0);
        if (data.totalLeafOptions === 0 && !checkStrictly.value) {
          data.selectionDisabled = true;
        }
      }
      optionMap.set(data.key, data);
      if (data.isLeaf || checkStrictly.value) {
        leafOptionSet.add(data);
        leafOptionMap.set(data.key, data);
        if (!leafOptionValueMap.has(data.valueKey)) {
          leafOptionValueMap.set(data.valueKey, data.key);
        }
      }
      return data;
    });
  };
  const result = travelOptions(options);
  innerLevel.value = totalLevel;
  return result;
};
const getCheckedStatus = (option, valueMap) => {
  var _a, _b;
  let checked = false;
  let indeterminate = false;
  if (option.isLeaf) {
    if (valueMap == null ? void 0 : valueMap.has(option.key)) {
      checked = true;
    }
  } else {
    const reg = new RegExp(`^${option.key}(-|$)`);
    const checkedLeafOptionNumber = Array.from((_a = valueMap == null ? void 0 : valueMap.keys()) != null ? _a : []).reduce(
      (pre, key) => {
        if (reg.test(key)) {
          return pre + 1;
        }
        return pre;
      },
      0
    );
    if (checkedLeafOptionNumber > 0 && checkedLeafOptionNumber >= ((_b = option.totalLeafOptions) != null ? _b : 1)) {
      checked = true;
    } else if (checkedLeafOptionNumber > 0) {
      indeterminate = true;
    }
  }
  return {
    checked,
    indeterminate
  };
};
const getLeafOptionKeys = (option) => {
  const keys = [];
  if (option.isLeaf) {
    keys.push(option.key);
  } else if (option.children) {
    for (const item of option.children) {
      keys.push(...getLeafOptionKeys(item));
    }
  }
  return keys;
};
const getLeafOptionInfos = (option) => {
  const infos = [];
  if (option.disabled || option.selectionDisabled) {
    return infos;
  }
  if (option.isLeaf) {
    infos.push(option);
  } else if (option.children) {
    for (const item of option.children) {
      infos.push(...getLeafOptionInfos(item));
    }
  }
  return infos;
};
const getValueKey = (value, {
  valueKey,
  leafOptionValueMap
}) => {
  var _a;
  if (is.isArray(value)) {
    return value.map((item) => {
      if (is.isObject(item))
        return item[valueKey];
      return item;
    }).join("-");
  }
  const _value = is.isObject(value) ? value[valueKey] : value;
  return (_a = leafOptionValueMap.get(String(_value))) != null ? _a : String(_value);
};
const getValidValues = (value, { multiple, pathMode }) => {
  if (!is.isArray(value)) {
    return is.isUndefined(value) || is.isNull(value) || value === "" ? [] : [value];
  }
  if (pathMode && !multiple && value.length > 0 && !is.isArray(value[0])) {
    return [value];
  }
  return value;
};
const getOptionLabel = (option) => {
  return option.path.map((item) => item.label).join(" / ");
};
exports.getCheckedStatus = getCheckedStatus;
exports.getLeafOptionInfos = getLeafOptionInfos;
exports.getLeafOptionKeys = getLeafOptionKeys;
exports.getOptionInfos = getOptionInfos;
exports.getOptionLabel = getOptionLabel;
exports.getValidValues = getValidValues;
exports.getValueKey = getValueKey;
