"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var utils = require("./utils.js");
var index = require("../trigger/index.js");
var selectView = require("../_components/select-view/select-view.js");
var selectDropdown = require("./select-dropdown.js");
var option = require("./option.js");
var optgroup = require("./optgroup.js");
var virtualList = require("../_components/virtual-list-v2/virtual-list.js");
var useSelect = require("./hooks/use-select.js");
var useTrigger = require("../_hooks/use-trigger.js");
var useFormItem = require("../_hooks/use-form-item.js");
var debounce = require("../_utils/debounce.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
const DEFAULT_FIELD_NAMES = {
  value: "value",
  label: "label",
  disabled: "disabled",
  tagProps: "tagProps",
  render: "render"
};
var _Select = vue.defineComponent({
  name: "Select",
  components: {
    Trigger: index,
    SelectView: selectView
  },
  inheritAttrs: false,
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array],
      default: void 0
    },
    defaultValue: {
      type: [String, Number, Boolean, Object, Array],
      default: (props) => is.isUndefined(props.multiple) ? "" : []
    },
    inputValue: {
      type: String
    },
    defaultInputValue: {
      type: String,
      default: ""
    },
    size: {
      type: String
    },
    placeholder: String,
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    allowSearch: {
      type: [Boolean, Object],
      default: (props) => Boolean(props.multiple)
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    maxTagCount: {
      type: Number,
      default: 0
    },
    popupContainer: {
      type: [String, Object]
    },
    bordered: {
      type: Boolean,
      default: true
    },
    defaultActiveFirstOption: {
      type: Boolean,
      default: true
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    unmountOnClose: {
      type: Boolean,
      default: false
    },
    filterOption: {
      type: [Boolean, Function],
      default: true
    },
    options: {
      type: Array,
      default: () => []
    },
    virtualListProps: {
      type: Object
    },
    triggerProps: {
      type: Object
    },
    formatLabel: {
      type: Function
    },
    fallbackOption: {
      type: [Boolean, Function],
      default: true
    },
    showExtraOptions: {
      type: Boolean,
      default: true
    },
    valueKey: {
      type: String,
      default: "value"
    },
    searchDelay: {
      type: Number,
      default: 500
    },
    limit: {
      type: Number,
      default: 0
    },
    fieldNames: {
      type: Object
    },
    scrollbar: {
      type: [Boolean, Object],
      default: true
    },
    showHeaderOnEmpty: {
      type: Boolean,
      default: false
    },
    showFooterOnEmpty: {
      type: Boolean,
      default: false
    },
    tagNowrap: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "update:inputValue": (inputValue) => true,
    "update:popupVisible": (visible) => true,
    "change": (value) => true,
    "inputValueChange": (inputValue) => true,
    "popupVisibleChange": (visible) => true,
    "clear": (ev) => true,
    "remove": (removed) => true,
    "search": (inputValue) => true,
    "dropdownScroll": (ev) => true,
    "dropdownReachBottom": (ev) => true,
    "exceedLimit": (value, ev) => true
  },
  setup(props, {
    slots,
    emit,
    attrs
  }) {
    const {
      size,
      disabled,
      error,
      options,
      filterOption,
      valueKey,
      multiple,
      popupVisible,
      defaultPopupVisible,
      showExtraOptions,
      modelValue,
      fieldNames,
      loading,
      defaultActiveFirstOption
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("select");
    const {
      mergedSize,
      mergedDisabled,
      mergedError,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      disabled,
      error
    });
    const component = vue.computed(() => props.virtualListProps ? "div" : "li");
    const retainInputValue = vue.computed(() => is.isObject(props.allowSearch) && Boolean(props.allowSearch.retainInputValue));
    vue.computed(() => {
      if (is.isFunction(props.formatLabel)) {
        return (data) => {
          const optionInfo = optionInfoMap.get(data.value);
          return props.formatLabel(optionInfo);
        };
      }
      return void 0;
    });
    const dropdownRef = vue.ref();
    const optionRefs = vue.ref({});
    const virtualListRef = vue.ref();
    const {
      computedPopupVisible,
      handlePopupVisibleChange
    } = useTrigger.useTrigger({
      popupVisible,
      defaultPopupVisible,
      emit
    });
    const _value = vue.ref(props.defaultValue);
    const computedValueObjects = vue.computed(() => {
      var _a;
      const mergedValue = (_a = props.modelValue) != null ? _a : _value.value;
      const valueArray = is.isArray(mergedValue) ? mergedValue : mergedValue || is.isNumber(mergedValue) || is.isString(mergedValue) || is.isBoolean(mergedValue) ? [mergedValue] : [];
      return valueArray.map((value) => ({
        value,
        key: utils.getKeyFromValue(value, props.valueKey)
      }));
    });
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = multiple.value ? [] : value;
      }
    });
    const computedValueKeys = vue.computed(() => computedValueObjects.value.map((obj) => obj.key));
    const mergedFieldNames = vue.computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...fieldNames == null ? void 0 : fieldNames.value
    }));
    const _selectedOption = vue.ref();
    const getRawOptionFromValueKeys = (valueKeys) => {
      const optionMap = {};
      valueKeys.forEach((key) => {
        optionMap[key] = optionInfoMap.get(key);
      });
      return optionMap;
    };
    const updateSelectedOption = (valueKeys) => {
      _selectedOption.value = getRawOptionFromValueKeys(valueKeys);
    };
    const getFallBackOption = (value) => {
      if (is.isFunction(props.fallbackOption)) {
        return props.fallbackOption(value);
      }
      return {
        [mergedFieldNames.value.value]: value,
        [mergedFieldNames.value.label]: String(is.isObject(value) ? value[valueKey == null ? void 0 : valueKey.value] : value)
      };
    };
    const getExtraValueData = () => {
      const valueArray = [];
      const keyArray = [];
      if (props.allowCreate || props.fallbackOption) {
        for (const item of computedValueObjects.value) {
          if (!keyArray.includes(item.key) && item.value !== "") {
            const optionInfo = optionInfoMap.get(item.key);
            if (!optionInfo || optionInfo.origin === "extraOptions") {
              valueArray.push(item);
              keyArray.push(item.key);
            }
          }
        }
      }
      if (props.allowCreate && computedInputValue.value) {
        const key = utils.getKeyFromValue(computedInputValue.value);
        if (!keyArray.includes(key)) {
          const optionInfo = optionInfoMap.get(key);
          if (!optionInfo || optionInfo.origin === "extraOptions") {
            valueArray.push({
              value: computedInputValue.value,
              key
            });
          }
        }
      }
      return valueArray;
    };
    const extraValueObjects = vue.ref([]);
    const extraOptions = vue.computed(() => extraValueObjects.value.map((obj) => {
      var _a;
      let optionInfo = getFallBackOption(obj.value);
      const extraOptionRawInfo = (_a = _selectedOption.value) == null ? void 0 : _a[obj.key];
      if (!is.isUndefined(extraOptionRawInfo) && !is.isEmptyObject(extraOptionRawInfo)) {
        optionInfo = {
          ...optionInfo,
          ...extraOptionRawInfo
        };
      }
      return optionInfo;
    }));
    vue.nextTick(() => {
      vue.watchEffect(() => {
        var _a;
        const valueData = getExtraValueData();
        if (valueData.length !== extraValueObjects.value.length) {
          extraValueObjects.value = valueData;
        } else if (valueData.length > 0) {
          for (let i = 0; i < valueData.length; i++) {
            if (valueData[i].key !== ((_a = extraValueObjects.value[i]) == null ? void 0 : _a.key)) {
              extraValueObjects.value = valueData;
              break;
            }
          }
        }
      });
    });
    const _inputValue = vue.ref("");
    const computedInputValue = vue.computed(() => {
      var _a;
      return (_a = props.inputValue) != null ? _a : _inputValue.value;
    });
    vue.watch(computedPopupVisible, (visible) => {
      if (!visible && !retainInputValue.value && computedInputValue.value) {
        updateInputValue("");
      }
    });
    const getValueFromValueKeys = (valueKeys) => {
      var _a, _b;
      if (!props.multiple) {
        return (_b = (_a = optionInfoMap.get(valueKeys[0])) == null ? void 0 : _a.value) != null ? _b : utils.hasEmptyStringKey(optionInfoMap) ? void 0 : "";
      }
      return valueKeys.map((key) => {
        var _a2, _b2;
        return (_b2 = (_a2 = optionInfoMap.get(key)) == null ? void 0 : _a2.value) != null ? _b2 : "";
      });
    };
    const updateValue = (valueKeys) => {
      var _a, _b;
      const value = getValueFromValueKeys(valueKeys);
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      updateSelectedOption(valueKeys);
    };
    const updateInputValue = (inputValue) => {
      _inputValue.value = inputValue;
      emit("update:inputValue", inputValue);
      emit("inputValueChange", inputValue);
    };
    const handleSelect = (key, ev) => {
      if (props.multiple) {
        if (!computedValueKeys.value.includes(key)) {
          if (enabledOptionKeys.value.includes(key)) {
            if (props.limit > 0 && computedValueKeys.value.length >= props.limit) {
              const info = optionInfoMap.get(key);
              emit("exceedLimit", info == null ? void 0 : info.value, ev);
            } else {
              const valueKeys = computedValueKeys.value.concat(key);
              updateValue(valueKeys);
            }
          }
        } else {
          const valueKeys = computedValueKeys.value.filter((_key) => _key !== key);
          updateValue(valueKeys);
        }
        if (!retainInputValue.value) {
          updateInputValue("");
        }
      } else {
        if (key !== computedValueKeys.value[0]) {
          updateValue([key]);
        }
        if (retainInputValue.value) {
          const optionInfo = optionInfoMap.get(key);
          if (optionInfo) {
            updateInputValue(optionInfo.label);
          }
        }
        handlePopupVisibleChange(false);
      }
    };
    const handleSearch = debounce.debounce((value) => {
      emit("search", value);
    }, props.searchDelay);
    const handleInputValueChange = (inputValue) => {
      if (inputValue !== computedInputValue.value) {
        if (!computedPopupVisible.value) {
          handlePopupVisibleChange(true);
        }
        updateInputValue(inputValue);
        if (props.allowSearch) {
          handleSearch(inputValue);
        }
      }
    };
    const handleRemove = (key) => {
      const optionInfo = optionInfoMap.get(key);
      const newKeys = computedValueKeys.value.filter((_key) => _key !== key);
      updateValue(newKeys);
      emit("remove", optionInfo == null ? void 0 : optionInfo.value);
    };
    const handleClear = (e) => {
      e == null ? void 0 : e.stopPropagation();
      const newKeys = computedValueKeys.value.filter((key) => {
        var _a;
        return (_a = optionInfoMap.get(key)) == null ? void 0 : _a.disabled;
      });
      updateValue(newKeys);
      updateInputValue("");
      emit("clear", e);
    };
    const handleDropdownScroll = (e) => {
      emit("dropdownScroll", e);
    };
    const handleDropdownReachBottom = (e) => {
      emit("dropdownReachBottom", e);
    };
    const {
      validOptions,
      optionInfoMap,
      validOptionInfos,
      enabledOptionKeys,
      handleKeyDown
    } = useSelect.useSelect({
      multiple,
      options,
      extraOptions,
      inputValue: computedInputValue,
      filterOption,
      showExtraOptions,
      component,
      valueKey,
      fieldNames,
      loading,
      popupVisible: computedPopupVisible,
      valueKeys: computedValueKeys,
      dropdownRef,
      optionRefs,
      virtualListRef,
      defaultActiveFirstOption,
      onSelect: handleSelect,
      onPopupVisibleChange: handlePopupVisibleChange
    });
    const selectViewValue = vue.computed(() => {
      var _a;
      const result = [];
      for (const item of computedValueObjects.value) {
        const optionInfo = optionInfoMap.get(item.key);
        if (optionInfo) {
          result.push({
            ...optionInfo,
            value: item.key,
            label: (_a = optionInfo == null ? void 0 : optionInfo.label) != null ? _a : String(is.isObject(item.value) ? item.value[valueKey == null ? void 0 : valueKey.value] : item.value),
            closable: !(optionInfo == null ? void 0 : optionInfo.disabled),
            tagProps: optionInfo == null ? void 0 : optionInfo.tagProps
          });
        }
      }
      return result;
    });
    const getOptionContentFunc = (optionInfo) => {
      if (is.isFunction(slots.option)) {
        const optionSlot = slots.option;
        return () => optionSlot({
          data: optionInfo.raw
        });
      }
      if (is.isFunction(optionInfo.render)) {
        return optionInfo.render;
      }
      return () => optionInfo.label;
    };
    const renderOption = (optionInfo) => {
      if (utils.isGroupOptionInfo(optionInfo)) {
        let _slot;
        return vue.createVNode(optgroup, {
          "key": optionInfo.key,
          "label": optionInfo.label
        }, _isSlot(_slot = optionInfo.options.map((child) => renderOption(child))) ? _slot : {
          default: () => [_slot]
        });
      }
      if (!utils.isValidOption(optionInfo, {
        inputValue: computedInputValue.value,
        filterOption: filterOption == null ? void 0 : filterOption.value
      })) {
        return null;
      }
      return vue.createVNode(option, {
        "ref": (ref) => {
          if (ref == null ? void 0 : ref.$el) {
            optionRefs.value[optionInfo.key] = ref.$el;
          }
        },
        "key": optionInfo.key,
        "value": optionInfo.value,
        "label": optionInfo.label,
        "disabled": optionInfo.disabled,
        "internal": true
      }, {
        default: getOptionContentFunc(optionInfo)
      });
    };
    const renderDropDown = () => {
      return vue.createVNode(selectDropdown, {
        "ref": dropdownRef,
        "loading": props.loading,
        "empty": validOptionInfos.value.length === 0,
        "virtualList": Boolean(props.virtualListProps),
        "scrollbar": props.scrollbar,
        "showHeaderOnEmpty": props.showHeaderOnEmpty,
        "showFooterOnEmpty": props.showFooterOnEmpty,
        "onScroll": handleDropdownScroll,
        "onReachBottom": handleDropdownReachBottom
      }, {
        "default": () => {
          var _a, _b;
          return [...(_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : [], ...validOptions.value.map(renderOption)];
        },
        "virtual-list": () => vue.createVNode(virtualList, vue.mergeProps(props.virtualListProps, {
          "ref": virtualListRef,
          "data": validOptions.value
        }), {
          item: ({
            item
          }) => renderOption(item)
        }),
        "empty": slots.empty,
        "header": slots.header,
        "footer": slots.footer
      });
    };
    const renderLabel = ({
      data
    }) => {
      var _a, _b, _c, _d;
      if ((slots.label || is.isFunction(props.formatLabel)) && data) {
        const optionInfo = optionInfoMap.get(data.value);
        if (optionInfo == null ? void 0 : optionInfo.raw) {
          return (_c = (_a = slots.label) == null ? void 0 : _a.call(slots, {
            data: optionInfo.raw
          })) != null ? _c : (_b = props.formatLabel) == null ? void 0 : _b.call(props, optionInfo.raw);
        }
      }
      return (_d = data == null ? void 0 : data.label) != null ? _d : "";
    };
    return () => vue.createVNode(index, vue.mergeProps({
      "trigger": "click",
      "position": "bl",
      "popupOffset": 4,
      "animationName": "slide-dynamic-origin",
      "hideEmpty": true,
      "preventFocus": true,
      "autoFitPopupWidth": true,
      "autoFitTransformOrigin": true,
      "disabled": mergedDisabled.value,
      "popupVisible": computedPopupVisible.value,
      "unmountOnClose": props.unmountOnClose,
      "clickToClose": !(props.allowSearch || props.allowCreate),
      "popupContainer": props.popupContainer,
      "onPopupVisibleChange": handlePopupVisibleChange
    }, props.triggerProps), {
      default: () => {
        var _a, _b;
        return [(_b = (_a = slots.trigger) == null ? void 0 : _a.call(slots)) != null ? _b : vue.createVNode(selectView, vue.mergeProps({
          "class": prefixCls,
          "modelValue": selectViewValue.value,
          "inputValue": computedInputValue.value,
          "multiple": props.multiple,
          "disabled": mergedDisabled.value,
          "error": mergedError.value,
          "loading": props.loading,
          "allowClear": props.allowClear,
          "allowCreate": props.allowCreate,
          "allowSearch": Boolean(props.allowSearch),
          "opened": computedPopupVisible.value,
          "maxTagCount": props.maxTagCount,
          "placeholder": props.placeholder,
          "bordered": props.bordered,
          "size": mergedSize.value,
          "tagNowrap": props.tagNowrap,
          "onInputValueChange": handleInputValueChange,
          "onRemove": handleRemove,
          "onClear": handleClear,
          "onKeydown": handleKeyDown
        }, attrs), {
          "label": renderLabel,
          "prefix": slots.prefix,
          "arrow-icon": slots["arrow-icon"],
          "loading-icon": slots["loading-icon"],
          "search-icon": slots["search-icon"]
        })];
      },
      content: renderDropDown
    });
  }
});
module.exports = _Select;
