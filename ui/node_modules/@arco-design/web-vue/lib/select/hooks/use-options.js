"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var utils = require("../utils.js");
var is = require("../../_utils/is.js");
const DEFAULT_FIELD_NAMES = {
  value: "value",
  label: "label",
  disabled: "disabled",
  tagProps: "tagProps",
  render: "render"
};
const useOptions = ({
  options,
  extraOptions,
  inputValue,
  filterOption,
  showExtraOptions,
  valueKey,
  fieldNames
}) => {
  const mergedFieldNames = vue.computed(() => ({
    ...DEFAULT_FIELD_NAMES,
    ...fieldNames == null ? void 0 : fieldNames.value
  }));
  const slotOptionInfoMap = vue.reactive(/* @__PURE__ */ new Map());
  const sortedSlotOptionInfos = vue.computed(
    () => Array.from(slotOptionInfoMap.values()).sort((a, b) => {
      if (is.isNumber(a.index) && is.isNumber(b.index)) {
        return a.index - b.index;
      }
      return 0;
    })
  );
  const propOptionData = vue.computed(() => {
    var _a, _b;
    const optionInfoMap2 = /* @__PURE__ */ new Map();
    const optionInfos = utils.getOptionInfos((_a = options == null ? void 0 : options.value) != null ? _a : [], {
      valueKey: (_b = valueKey == null ? void 0 : valueKey.value) != null ? _b : "value",
      fieldNames: mergedFieldNames.value,
      origin: "options",
      optionInfoMap: optionInfoMap2
    });
    return {
      optionInfos,
      optionInfoMap: optionInfoMap2
    };
  });
  const extraOptionData = vue.computed(() => {
    var _a, _b;
    const optionInfoMap2 = /* @__PURE__ */ new Map();
    const optionInfos = utils.getOptionInfos((_a = extraOptions == null ? void 0 : extraOptions.value) != null ? _a : [], {
      valueKey: (_b = valueKey == null ? void 0 : valueKey.value) != null ? _b : "value",
      fieldNames: mergedFieldNames.value,
      origin: "extraOptions",
      optionInfoMap: optionInfoMap2
    });
    return {
      optionInfos,
      optionInfoMap: optionInfoMap2
    };
  });
  const optionInfoMap = vue.reactive(/* @__PURE__ */ new Map());
  vue.watch(
    [
      sortedSlotOptionInfos,
      options != null ? options : vue.ref([]),
      extraOptions != null ? extraOptions : vue.ref([]),
      valueKey != null ? valueKey : vue.ref("value")
    ],
    () => {
      optionInfoMap.clear();
      sortedSlotOptionInfos.value.forEach((info, index) => {
        optionInfoMap.set(info.key, { ...info, index });
      });
      propOptionData.value.optionInfoMap.forEach((info) => {
        if (!optionInfoMap.has(info.key)) {
          info.index = optionInfoMap.size;
          optionInfoMap.set(info.key, info);
        }
      });
      extraOptionData.value.optionInfoMap.forEach((info) => {
        if (!optionInfoMap.has(info.key)) {
          info.index = optionInfoMap.size;
          optionInfoMap.set(info.key, info);
        }
      });
    },
    { immediate: true, deep: true }
  );
  const validOptions = vue.computed(() => {
    var _a;
    const options2 = utils.getValidOptions(propOptionData.value.optionInfos, {
      inputValue: inputValue == null ? void 0 : inputValue.value,
      filterOption: filterOption == null ? void 0 : filterOption.value
    });
    if ((_a = showExtraOptions == null ? void 0 : showExtraOptions.value) != null ? _a : true) {
      options2.push(
        ...utils.getValidOptions(extraOptionData.value.optionInfos, {
          inputValue: inputValue == null ? void 0 : inputValue.value,
          filterOption: filterOption == null ? void 0 : filterOption.value
        })
      );
    }
    return options2;
  });
  const validOptionInfos = vue.computed(
    () => Array.from(optionInfoMap.values()).filter((optionInfo) => {
      if (optionInfo.origin === "extraOptions" && (showExtraOptions == null ? void 0 : showExtraOptions.value) === false) {
        return false;
      }
      return utils.isValidOption(optionInfo, {
        inputValue: inputValue == null ? void 0 : inputValue.value,
        filterOption: filterOption == null ? void 0 : filterOption.value
      });
    })
  );
  const enabledOptionKeys = vue.computed(
    () => validOptionInfos.value.filter((optionInfo) => !optionInfo.disabled).map((info) => info.key)
  );
  const getNextSlotOptionIndex = () => slotOptionInfoMap.size;
  const addSlotOptionInfo = (id, optionInfo) => {
    slotOptionInfoMap.set(id, optionInfo);
  };
  const removeSlotOptionInfo = (id) => {
    slotOptionInfoMap.delete(id);
  };
  return {
    validOptions,
    optionInfoMap,
    validOptionInfos,
    enabledOptionKeys,
    getNextSlotOptionIndex,
    addSlotOptionInfo,
    removeSlotOptionInfo
  };
};
exports.useOptions = useOptions;
