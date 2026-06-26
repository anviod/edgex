"use strict";
var vue = require("vue");
var index$1 = require("../input/index.js");
var index = require("../trigger/index.js");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var selectDropdown = require("../select/select-dropdown.js");
var option = require("../select/option.js");
var useSelect = require("../select/hooks/use-select.js");
var utils = require("../select/utils.js");
var useFormItem = require("../_hooks/use-form-item.js");
var virtualList = require("../_components/virtual-list-v2/virtual-list.js");
var _AutoComplete = vue.defineComponent({
  name: "AutoComplete",
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: void 0
    },
    defaultValue: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    popupContainer: {
      type: [String, Object]
    },
    strict: {
      type: Boolean,
      default: false
    },
    filterOption: {
      type: [Boolean, Function],
      default: true
    },
    triggerProps: {
      type: Object
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    virtualListProps: {
      type: Object
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true,
    "search": (value) => true,
    "select": (value) => true,
    "clear": (ev) => true,
    "dropdownScroll": (ev) => true,
    "dropdownReachBottom": (ev) => true
  },
  setup(props, {
    emit,
    attrs,
    slots
  }) {
    const {
      modelValue
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("auto-complete");
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const _value = vue.ref(props.defaultValue);
    const inputRef = vue.ref();
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = "";
      }
    });
    const computedValueKeys = vue.computed(() => computedValue.value ? [utils.getKeyFromValue(computedValue.value)] : []);
    const {
      data
    } = vue.toRefs(props);
    const dropdownRef = vue.ref();
    const optionRefs = vue.ref({});
    const _popupVisible = vue.ref(false);
    const computedPopupVisible = vue.computed(() => _popupVisible.value && validOptionInfos.value.length > 0);
    const virtualListRef = vue.ref();
    const component = vue.computed(() => props.virtualListProps ? "div" : "li");
    const handlePopupVisibleChange = (popupVisible) => {
      _popupVisible.value = popupVisible;
    };
    const strictFilterOption = (inputValue, option2) => {
      var _a;
      return Boolean((_a = option2.label) == null ? void 0 : _a.includes(inputValue));
    };
    const mergedFilterOption = vue.computed(() => {
      if (is.isFunction(props.filterOption)) {
        return props.filterOption;
      }
      if (props.filterOption && props.strict) {
        return strictFilterOption;
      }
      return props.filterOption;
    });
    const handleChange = (value) => {
      var _a, _b;
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
    };
    const handleClear = (ev) => {
      var _a, _b;
      _value.value = "";
      emit("update:modelValue", "");
      emit("change", "");
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      emit("clear", ev);
    };
    const handleSelect = (key, ev) => {
      var _a, _b;
      const value = (_a = optionInfoMap.get(key)) == null ? void 0 : _a.value;
      emit("select", value);
      handleChange(value);
      (_b = inputRef.value) == null ? void 0 : _b.blur();
    };
    const handleInputValueChange = (value) => {
      emit("search", value);
      handleChange(value);
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
      handleKeyDown
    } = useSelect.useSelect({
      options: data,
      inputValue: computedValue,
      filterOption: mergedFilterOption,
      popupVisible: computedPopupVisible,
      valueKeys: computedValueKeys,
      component,
      dropdownRef,
      optionRefs,
      onSelect: handleSelect,
      onPopupVisibleChange: handlePopupVisibleChange
    });
    const getOptionContentFunc = (item) => {
      if (is.isFunction(slots.option) && item.value) {
        const optionInfo = optionInfoMap.get(item.key);
        const optionSlot = slots.option;
        return () => optionSlot({
          data: optionInfo
        });
      }
      return () => item.label;
    };
    const renderOption = (item) => {
      return vue.createVNode(option, {
        "ref": (ref) => {
          if (ref == null ? void 0 : ref.$el) {
            optionRefs.value[item.key] = ref.$el;
          }
        },
        "key": item.key,
        "value": item.value,
        "disabled": item.disabled,
        "internal": true
      }, {
        default: getOptionContentFunc(item)
      });
    };
    const renderDropdown = () => {
      return vue.createVNode(selectDropdown, {
        "ref": dropdownRef,
        "class": `${prefixCls}-dropdown`,
        "virtualList": Boolean(props.virtualListProps),
        "onScroll": handleDropdownScroll,
        "onReachBottom": handleDropdownReachBottom
      }, {
        "default": () => [...validOptions.value.map((info) => renderOption(info))],
        "virtual-list": () => vue.createVNode(virtualList, vue.mergeProps(props.virtualListProps, {
          "ref": virtualListRef,
          "data": validOptions.value
        }), {
          item: ({
            item
          }) => renderOption(item)
        }),
        "footer": slots.footer
      });
    };
    const render = () => vue.createVNode(index, vue.mergeProps({
      "trigger": "focus",
      "position": "bl",
      "animationName": "slide-dynamic-origin",
      "autoFitTransformOrigin": true,
      "popupVisible": computedPopupVisible.value,
      "clickToClose": false,
      "preventFocus": true,
      "popupOffset": 4,
      "disabled": mergedDisabled.value,
      "autoFitPopupWidth": true
    }, props.triggerProps, {
      "onPopupVisibleChange": handlePopupVisibleChange
    }), {
      default: () => [vue.createVNode(index$1["default"], vue.mergeProps({
        "ref": inputRef
      }, attrs, {
        "allowClear": props.allowClear,
        "modelValue": computedValue.value,
        "disabled": mergedDisabled.value,
        "onInput": handleInputValueChange,
        "onClear": handleClear,
        "onKeydown": handleKeyDown
      }), slots)],
      content: renderDropdown
    });
    return {
      inputRef,
      render
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.blur();
    }
  },
  render() {
    return this.render();
  }
});
module.exports = _AutoComplete;
