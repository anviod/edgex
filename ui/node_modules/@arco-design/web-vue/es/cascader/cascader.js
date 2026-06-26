import { defineComponent, toRefs, ref, watch, reactive, computed, provide, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createSlots, renderSlot, createVNode, normalizeProps, guardReactiveProps } from "vue";
import { getOptionInfos, getValidValues, getValueKey, getOptionLabel, getLeafOptionInfos, getLeafOptionKeys, getCheckedStatus } from "./utils.js";
import Trigger from "../trigger/index.js";
import SelectView from "../_components/select-view/select-view.js";
import BaseCascaderPanel from "./base-cascader-panel.js";
import CascaderSearchPanel from "./cascader-search-panel.js";
import { isUndefined, isNull, isFunction, isArray } from "../_utils/is.js";
import { useSelectedPath } from "./hooks/use-selected-path.js";
import { getKeyDownHandler, KEYBOARD_KEY } from "../_utils/keyboard.js";
import { cascaderInjectionKey } from "./context.js";
import { debounce } from "../_utils/debounce.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Cascader",
  components: {
    Trigger,
    SelectView,
    BaseCascaderPanel,
    CascaderSearchPanel
  },
  inheritAttrs: false,
  props: {
    pathMode: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, Object, Array]
    },
    defaultValue: {
      type: [String, Number, Object, Array],
      default: (props) => props.multiple ? [] : props.pathMode ? void 0 : ""
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    allowSearch: {
      type: Boolean,
      default: (props) => Boolean(props.multiple)
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    inputValue: {
      type: String,
      default: void 0
    },
    defaultInputValue: {
      type: String,
      default: ""
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    expandTrigger: {
      type: String,
      default: "click"
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    filterOption: {
      type: Function
    },
    popupContainer: {
      type: [String, Object]
    },
    maxTagCount: {
      type: Number,
      default: 0
    },
    formatLabel: {
      type: Function
    },
    triggerProps: {
      type: Object
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    loadMore: {
      type: Function
    },
    loading: {
      type: Boolean,
      default: false
    },
    searchOptionOnlyLabel: {
      type: Boolean,
      default: false
    },
    searchDelay: {
      type: Number,
      default: 500
    },
    fieldNames: {
      type: Object
    },
    valueKey: {
      type: String,
      default: "value"
    },
    fallback: {
      type: [Boolean, Function],
      default: true
    },
    expandChild: {
      type: Boolean,
      default: false
    },
    virtualListProps: {
      type: Object
    },
    tagNowrap: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "update:popupVisible": (visible) => true,
    "change": (value) => true,
    "inputValueChange": (value) => true,
    "clear": () => true,
    "search": (value) => true,
    "popupVisibleChange": (visible) => true,
    "focus": (ev) => true,
    "blur": (ev) => true
  },
  setup(props, { emit, slots }) {
    const {
      options,
      checkStrictly,
      loadMore,
      formatLabel,
      modelValue,
      disabled,
      valueKey,
      expandTrigger,
      expandChild,
      pathMode,
      multiple
    } = toRefs(props);
    const _value = ref(props.defaultValue);
    const _inputValue = ref(props.defaultInputValue);
    const _popupVisible = ref(props.defaultPopupVisible);
    const { mergedDisabled, eventHandlers } = useFormItem({ disabled });
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = props.multiple ? [] : void 0;
      }
    });
    const optionInfos = ref([]);
    const totalLevel = ref(1);
    const optionMap = reactive(/* @__PURE__ */ new Map());
    const leafOptionMap = reactive(/* @__PURE__ */ new Map());
    const leafOptionValueMap = reactive(/* @__PURE__ */ new Map());
    const leafOptionSet = reactive(/* @__PURE__ */ new Set());
    const lazyLoadOptions = reactive({});
    const addLazyLoadOptions = (children, key) => {
      lazyLoadOptions[key] = children;
    };
    const DEFAULT_FIELD_NAMES = {
      value: "value",
      label: "label",
      disabled: "disabled",
      children: "children",
      tagProps: "tagProps",
      render: "render",
      isLeaf: "isLeaf"
    };
    const mergedFieldNames = computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames
    }));
    watch(
      [options, lazyLoadOptions, mergedFieldNames],
      ([_options, _lazyLoadOptions, _fieldNames]) => {
        optionMap.clear();
        leafOptionMap.clear();
        leafOptionValueMap.clear();
        leafOptionSet.clear();
        optionInfos.value = getOptionInfos(_options != null ? _options : [], {
          enabledLazyLoad: Boolean(props.loadMore),
          lazyLoadOptions,
          optionMap,
          leafOptionSet,
          leafOptionMap,
          leafOptionValueMap,
          totalLevel,
          checkStrictly,
          valueKey,
          fieldNames: _fieldNames
        });
      },
      {
        immediate: true,
        deep: true
      }
    );
    const computedValueMap = computed(() => {
      var _a;
      const values = getValidValues((_a = props.modelValue) != null ? _a : _value.value, {
        multiple: props.multiple,
        pathMode: props.pathMode
      });
      return new Map(
        values.map((value) => [
          getValueKey(value, {
            valueKey: props.valueKey,
            leafOptionValueMap
          }),
          value
        ])
      );
    });
    const computedInputValue = computed(
      () => {
        var _a;
        return (_a = props.inputValue) != null ? _a : _inputValue.value;
      }
    );
    const computedPopupVisible = computed(
      () => {
        var _a;
        return (_a = props.popupVisible) != null ? _a : _popupVisible.value;
      }
    );
    const getFilteredStatus = (label) => {
      var _a;
      return label == null ? void 0 : label.toLocaleLowerCase().includes((_a = computedInputValue.value) == null ? void 0 : _a.toLocaleLowerCase());
    };
    const filteredLeafOptions = computed(() => {
      const options2 = props.checkStrictly ? Array.from(optionMap.values()) : Array.from(leafOptionSet);
      return options2.filter((item) => {
        var _a;
        if (isFunction(props.filterOption)) {
          return props.filterOption(computedInputValue.value, item.raw);
        }
        if (props.checkStrictly) {
          return getFilteredStatus(item.label);
        }
        return (_a = item.path) == null ? void 0 : _a.find((leaf) => getFilteredStatus(leaf.label));
      });
    });
    const updateValue = (values) => {
      var _a, _b, _c;
      const value = props.multiple ? values : (_a = values[0]) != null ? _a : "";
      if (values.length === 0) {
        setSelectedPath();
        setActiveKey();
      }
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      (_c = (_b = eventHandlers.value) == null ? void 0 : _b.onChange) == null ? void 0 : _c.call(_b);
    };
    watch([multiple, pathMode], () => {
      const values = [];
      computedValueMap.value.forEach((value, key) => {
        const option = leafOptionMap.get(key);
        if (option) {
          values.push(pathMode.value ? option.pathValue : option.value);
        }
      });
      updateValue(values);
    });
    const handlePopupVisibleChange = (visible) => {
      if (computedPopupVisible.value !== visible) {
        _popupVisible.value = visible;
        emit("popupVisibleChange", visible);
      }
    };
    const handleRemove = (key) => {
      if (props.multiple) {
        const option = leafOptionMap.get(key);
        if (option) {
          selectMultiple(option, false);
        } else {
          const values = [];
          computedValueMap.value.forEach((value, _key) => {
            if (_key !== key) {
              values.push(value);
            }
          });
          updateValue(values);
        }
      }
    };
    const selectSingle = (option) => {
      updateValue([props.pathMode ? option.pathValue : option.value]);
      handlePopupVisibleChange(false);
    };
    const selectMultiple = (option, checked) => {
      if (checked) {
        const leafOptionInfos = props.checkStrictly ? [option] : getLeafOptionInfos(option);
        updateValue([
          ...computedValueMap.value.values(),
          ...leafOptionInfos.filter((item) => !computedValueMap.value.has(item.key)).map((item) => {
            return props.pathMode ? item.pathValue : item.value;
          })
        ]);
      } else {
        const leafOptionKeys = props.checkStrictly ? [option.key] : getLeafOptionKeys(option);
        const values = [];
        computedValueMap.value.forEach((value, key) => {
          if (!leafOptionKeys.includes(key)) {
            values.push(value);
          }
        });
        updateValue(values);
      }
      handleInputValueChange("", "optionChecked");
    };
    const handleClickOption = (option, checked) => {
      if (props.multiple) {
        selectMultiple(option, checked != null ? checked : true);
      } else {
        selectSingle(option);
      }
    };
    const handleSearch = debounce((value) => {
      emit("search", value);
    }, props.searchDelay);
    const handleInputValueChange = (value, reason) => {
      if (value !== computedInputValue.value) {
        if (reason === "manual" && !computedPopupVisible.value) {
          _popupVisible.value = true;
          emit("popupVisibleChange", true);
        }
        _inputValue.value = value;
        emit("inputValueChange", value);
        if (props.allowSearch) {
          handleSearch(value);
        }
      }
    };
    watch(computedPopupVisible, (value) => {
      if (value) {
        if (computedValueMap.value.size > 0) {
          const keys = Array.from(computedValueMap.value.keys());
          const lastKey = keys[keys.length - 1];
          const option = leafOptionMap.get(lastKey);
          if (option && option.key !== activeKey.value) {
            setSelectedPath(option.key);
            setActiveKey(option.key);
          }
        }
      } else {
        if (computedValueMap.value.size === 0) {
          setSelectedPath();
          setActiveKey();
        }
        handleInputValueChange("", "optionListHide");
      }
    });
    const handleClear = (e) => {
      e.stopPropagation();
      if (props.multiple) {
        const newValues = [];
        computedValueMap.value.forEach((value, key) => {
          const option = leafOptionMap.get(key);
          if (option == null ? void 0 : option.disabled) {
            newValues.push(props.pathMode ? option.pathValue : option.value);
          }
        });
        updateValue(newValues);
      } else {
        updateValue([]);
      }
      handleInputValueChange("", "manual");
      emit("clear");
    };
    const showSearchPanel = computed(
      () => props.allowSearch && computedInputValue.value.length > 0
    );
    const handleFocus = (e) => {
      emit("focus", e);
    };
    const handleBlur = (e) => {
      emit("blur", e);
    };
    const {
      activeKey,
      activeOption,
      selectedPath,
      displayColumns,
      setActiveKey,
      setSelectedPath,
      getNextActiveNode
    } = useSelectedPath(optionInfos, {
      optionMap,
      filteredLeafOptions,
      showSearchPanel,
      expandChild
    });
    provide(
      cascaderInjectionKey,
      reactive({
        onClickOption: handleClickOption,
        setActiveKey,
        setSelectedPath,
        loadMore,
        expandTrigger,
        addLazyLoadOptions,
        formatLabel,
        slots,
        valueMap: computedValueMap
      })
    );
    const handleKeyDown = getKeyDownHandler(
      /* @__PURE__ */ new Map([
        [
          KEYBOARD_KEY.ENTER,
          (ev) => {
            if (computedPopupVisible.value) {
              if (activeOption.value) {
                let checked;
                if (props.checkStrictly || activeOption.value.isLeaf) {
                  checked = !computedValueMap.value.has(activeOption.value.key);
                } else {
                  checked = !getCheckedStatus(
                    activeOption.value,
                    computedValueMap.value
                  ).checked;
                }
                setSelectedPath(activeOption.value.key);
                handleClickOption(activeOption.value, checked);
              }
            } else {
              handlePopupVisibleChange(true);
            }
          }
        ],
        [
          KEYBOARD_KEY.ESC,
          (ev) => {
            handlePopupVisibleChange(false);
          }
        ],
        [
          KEYBOARD_KEY.ARROW_DOWN,
          (ev) => {
            ev.preventDefault();
            const activeNode = getNextActiveNode("next");
            setActiveKey(activeNode == null ? void 0 : activeNode.key);
          }
        ],
        [
          KEYBOARD_KEY.ARROW_UP,
          (ev) => {
            ev.preventDefault();
            const activeNode = getNextActiveNode("preview");
            setActiveKey(activeNode == null ? void 0 : activeNode.key);
          }
        ],
        [
          KEYBOARD_KEY.ARROW_RIGHT,
          (ev) => {
            var _a, _b;
            if (!showSearchPanel.value) {
              ev.preventDefault();
              if ((_a = activeOption.value) == null ? void 0 : _a.children) {
                setSelectedPath(activeOption.value.key);
                setActiveKey((_b = activeOption.value.children[0]) == null ? void 0 : _b.key);
              }
            }
          }
        ],
        [
          KEYBOARD_KEY.ARROW_LEFT,
          (ev) => {
            var _a;
            if (!showSearchPanel.value) {
              ev.preventDefault();
              if ((_a = activeOption.value) == null ? void 0 : _a.parent) {
                setSelectedPath(activeOption.value.parent.key);
                setActiveKey(activeOption.value.parent.key);
              }
            }
          }
        ]
      ])
    );
    const selectViewValue = computed(() => {
      const result = [];
      computedValueMap.value.forEach((value, key) => {
        var _a, _b;
        const option = leafOptionMap.get(key);
        if (option) {
          result.push({
            value: key,
            label: (_b = (_a = props.formatLabel) == null ? void 0 : _a.call(props, option.path.map((item) => item.raw))) != null ? _b : getOptionLabel(option),
            closable: !option.disabled,
            tagProps: option.tagProps
          });
        } else if (props.fallback) {
          const label = isFunction(props.fallback) ? props.fallback(value) : isArray(value) ? value.join(" / ") : String(value);
          result.push({
            value: key,
            label,
            closable: true
          });
        }
      });
      return result;
    });
    return {
      optionInfos,
      filteredLeafOptions,
      selectedPath,
      activeKey,
      displayColumns,
      computedInputValue,
      computedPopupVisible,
      handleClear,
      selectViewValue,
      handleInputValueChange,
      showSearchPanel,
      handlePopupVisibleChange,
      handleFocus,
      handleBlur,
      handleRemove,
      mergedDisabled,
      handleKeyDown,
      totalLevel
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_select_view = resolveComponent("select-view");
  const _component_cascader_search_panel = resolveComponent("cascader-search-panel");
  const _component_base_cascader_panel = resolveComponent("base-cascader-panel");
  const _component_trigger = resolveComponent("trigger");
  return openBlock(), createBlock(_component_trigger, mergeProps(_ctx.triggerProps, {
    trigger: "click",
    "animation-name": "slide-dynamic-origin",
    "auto-fit-transform-origin": "",
    "popup-visible": _ctx.computedPopupVisible,
    position: "bl",
    disabled: _ctx.mergedDisabled,
    "popup-offset": 4,
    "auto-fit-popup-width": _ctx.showSearchPanel,
    "popup-container": _ctx.popupContainer,
    "prevent-focus": true,
    "click-to-close": !_ctx.allowSearch,
    onPopupVisibleChange: _ctx.handlePopupVisibleChange
  }), {
    content: withCtx(() => [
      _ctx.showSearchPanel ? (openBlock(), createBlock(_component_cascader_search_panel, {
        key: 0,
        options: _ctx.filteredLeafOptions,
        "active-key": _ctx.activeKey,
        multiple: _ctx.multiple,
        "check-strictly": _ctx.checkStrictly,
        loading: _ctx.loading,
        "path-label": !_ctx.searchOptionOnlyLabel
      }, createSlots({ _: 2 }, [
        _ctx.$slots.empty ? {
          name: "empty",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "empty")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["options", "active-key", "multiple", "check-strictly", "loading", "path-label"])) : (openBlock(), createBlock(_component_base_cascader_panel, {
        key: 1,
        "display-columns": _ctx.displayColumns,
        "selected-path": _ctx.selectedPath,
        "active-key": _ctx.activeKey,
        multiple: _ctx.multiple,
        "total-level": _ctx.totalLevel,
        "check-strictly": _ctx.checkStrictly,
        loading: _ctx.loading,
        "virtual-list-props": _ctx.virtualListProps,
        dropdown: ""
      }, createSlots({ _: 2 }, [
        _ctx.$slots.empty ? {
          name: "empty",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "empty")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["display-columns", "selected-path", "active-key", "multiple", "total-level", "check-strictly", "loading", "virtual-list-props"]))
    ]),
    default: withCtx(() => [
      createVNode(_component_select_view, mergeProps({
        "model-value": _ctx.selectViewValue,
        "input-value": _ctx.computedInputValue,
        disabled: _ctx.mergedDisabled,
        error: _ctx.error,
        multiple: _ctx.multiple,
        "allow-clear": _ctx.allowClear,
        "allow-search": _ctx.allowSearch,
        size: _ctx.size,
        opened: _ctx.computedPopupVisible,
        placeholder: _ctx.placeholder,
        loading: _ctx.loading,
        "max-tag-count": _ctx.maxTagCount,
        "tag-nowrap": _ctx.tagNowrap
      }, _ctx.$attrs, {
        onInputValueChange: _ctx.handleInputValueChange,
        onClear: _ctx.handleClear,
        onFocus: _ctx.handleFocus,
        onBlur: _ctx.handleBlur,
        onRemove: _ctx.handleRemove,
        onKeydown: _ctx.handleKeyDown
      }), createSlots({ _: 2 }, [
        _ctx.$slots.label ? {
          name: "label",
          fn: withCtx((data) => [
            renderSlot(_ctx.$slots, "label", normalizeProps(guardReactiveProps(data)))
          ]),
          key: "0"
        } : void 0,
        _ctx.$slots.prefix ? {
          name: "prefix",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "prefix")
          ]),
          key: "1"
        } : void 0,
        _ctx.$slots["arrow-icon"] ? {
          name: "arrow-icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "arrow-icon")
          ]),
          key: "2"
        } : void 0,
        _ctx.$slots["loading-icon"] ? {
          name: "loading-icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "loading-icon")
          ]),
          key: "3"
        } : void 0,
        _ctx.$slots["search-icon"] ? {
          name: "search-icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "search-icon")
          ]),
          key: "4"
        } : void 0
      ]), 1040, ["model-value", "input-value", "disabled", "error", "multiple", "allow-clear", "allow-search", "size", "opened", "placeholder", "loading", "max-tag-count", "tag-nowrap", "onInputValueChange", "onClear", "onFocus", "onBlur", "onRemove", "onKeydown"])
    ]),
    _: 3
  }, 16, ["popup-visible", "disabled", "auto-fit-popup-width", "popup-container", "click-to-close", "onPopupVisibleChange"]);
}
var _Cascader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Cascader as default };
