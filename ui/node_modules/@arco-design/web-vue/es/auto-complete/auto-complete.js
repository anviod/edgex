import { defineComponent, toRefs, toRef, ref, computed, watch, createVNode, mergeProps } from "vue";
import Input from "../input/index.js";
import Trigger from "../trigger/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { isUndefined, isNull, isFunction } from "../_utils/is.js";
import SelectDropdown from "../select/select-dropdown.js";
import Option from "../select/option.js";
import { useSelect } from "../select/hooks/use-select.js";
import { getKeyFromValue } from "../select/utils.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import VirtualList from "../_components/virtual-list-v2/virtual-list.js";
var _AutoComplete = defineComponent({
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
    } = toRefs(props);
    const prefixCls = getPrefixCls("auto-complete");
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem({
      disabled: toRef(props, "disabled")
    });
    const _value = ref(props.defaultValue);
    const inputRef = ref();
    const computedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = "";
      }
    });
    const computedValueKeys = computed(() => computedValue.value ? [getKeyFromValue(computedValue.value)] : []);
    const {
      data
    } = toRefs(props);
    const dropdownRef = ref();
    const optionRefs = ref({});
    const _popupVisible = ref(false);
    const computedPopupVisible = computed(() => _popupVisible.value && validOptionInfos.value.length > 0);
    const virtualListRef = ref();
    const component = computed(() => props.virtualListProps ? "div" : "li");
    const handlePopupVisibleChange = (popupVisible) => {
      _popupVisible.value = popupVisible;
    };
    const strictFilterOption = (inputValue, option) => {
      var _a;
      return Boolean((_a = option.label) == null ? void 0 : _a.includes(inputValue));
    };
    const mergedFilterOption = computed(() => {
      if (isFunction(props.filterOption)) {
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
    } = useSelect({
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
      if (isFunction(slots.option) && item.value) {
        const optionInfo = optionInfoMap.get(item.key);
        const optionSlot = slots.option;
        return () => optionSlot({
          data: optionInfo
        });
      }
      return () => item.label;
    };
    const renderOption = (item) => {
      return createVNode(Option, {
        "ref": (ref2) => {
          if (ref2 == null ? void 0 : ref2.$el) {
            optionRefs.value[item.key] = ref2.$el;
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
      return createVNode(SelectDropdown, {
        "ref": dropdownRef,
        "class": `${prefixCls}-dropdown`,
        "virtualList": Boolean(props.virtualListProps),
        "onScroll": handleDropdownScroll,
        "onReachBottom": handleDropdownReachBottom
      }, {
        "default": () => [...validOptions.value.map((info) => renderOption(info))],
        "virtual-list": () => createVNode(VirtualList, mergeProps(props.virtualListProps, {
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
    const render = () => createVNode(Trigger, mergeProps({
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
      default: () => [createVNode(Input, mergeProps({
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
export { _AutoComplete as default };
