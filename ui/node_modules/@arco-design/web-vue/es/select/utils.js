import { isObject, isNumber, isString, isBoolean, isFunction } from "../_utils/is.js";
const isGroupOption = (option) => {
  return isObject(option) && "isGroup" in option;
};
const isGroupOptionInfo = (option) => {
  return isObject(option) && "isGroup" in option;
};
const getValueString = (value, valueKey = "value") => String(isObject(value) ? value[valueKey] : value);
const getKeyFromValue = (value, valueKey = "value") => {
  if (isObject(value)) {
    return `__arco__option__object__${value[valueKey]}`;
  }
  if (value || isNumber(value) || isString(value) || isBoolean(value)) {
    return `__arco__option__${typeof value}-${value}`;
  }
  return "";
};
const hasEmptyStringKey = (optionInfoMap) => {
  return optionInfoMap.has(`__arco__option__string-`);
};
const createOptionInfo = (option, {
  valueKey,
  fieldNames,
  origin,
  index = -1
}) => {
  var _a;
  if (isObject(option)) {
    const value = option[fieldNames.value];
    return {
      raw: option,
      index,
      key: getKeyFromValue(value, valueKey),
      origin,
      value,
      label: (_a = option[fieldNames.label]) != null ? _a : getValueString(value, valueKey),
      render: option[fieldNames.render],
      disabled: Boolean(option[fieldNames.disabled]),
      tagProps: option[fieldNames.tagProps]
    };
  }
  const raw = {
    value: option,
    label: String(option),
    disabled: false
  };
  return {
    raw,
    index,
    key: getKeyFromValue(option, valueKey),
    origin,
    ...raw
  };
};
const getOptionInfos = (options, {
  valueKey,
  fieldNames,
  origin,
  optionInfoMap
}) => {
  var _a;
  const infos = [];
  for (const item of options) {
    if (isGroupOption(item)) {
      const options2 = getOptionInfos((_a = item.options) != null ? _a : [], {
        valueKey,
        fieldNames,
        origin,
        optionInfoMap
      });
      if (options2.length > 0) {
        infos.push({
          ...item,
          key: `__arco__group__${item.label}`,
          options: options2
        });
      }
    } else {
      const optionInfo = createOptionInfo(item, {
        valueKey,
        fieldNames,
        origin
      });
      infos.push(optionInfo);
      if (!optionInfoMap.get(optionInfo.key)) {
        optionInfoMap.set(optionInfo.key, optionInfo);
      }
    }
  }
  return infos;
};
const getValidOptions = (optionInfos, {
  inputValue,
  filterOption
}) => {
  const travel = (optionInfos2) => {
    var _a;
    const options = [];
    for (const item of optionInfos2) {
      if (isGroupOptionInfo(item)) {
        const _options = travel((_a = item.options) != null ? _a : []);
        if (_options.length > 0) {
          options.push({ ...item, options: _options });
        }
      } else if (isValidOption(item, { inputValue, filterOption })) {
        options.push(item);
      }
    }
    return options;
  };
  return travel(optionInfos);
};
const isValidOption = (optionInfo, {
  inputValue,
  filterOption
}) => {
  if (isFunction(filterOption)) {
    return !inputValue || filterOption(inputValue, optionInfo.raw);
  }
  if (filterOption) {
    return optionInfo.label.toLowerCase().includes((inputValue != null ? inputValue : "").toLowerCase());
  }
  return true;
};
export { createOptionInfo, getKeyFromValue, getOptionInfos, getValidOptions, getValueString, hasEmptyStringKey, isGroupOption, isGroupOptionInfo, isValidOption };
