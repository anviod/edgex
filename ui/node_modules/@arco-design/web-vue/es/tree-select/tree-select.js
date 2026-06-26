import { defineComponent, toRefs, inject, computed, reactive, ref, nextTick, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createElementVNode, normalizeClass, normalizeStyle, createElementBlock, renderSlot, createCommentVNode, createVNode, resolveDynamicComponent, createSlots, normalizeProps, guardReactiveProps } from "vue";
import useMergeState from "../_hooks/use-merge-state.js";
import Trigger from "../trigger/index.js";
import SelectView from "../_components/select-view/select-view.js";
import Panel from "./panel.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import useSelectedState from "./hooks/use-selected-state.js";
import useTreeData from "../tree/hooks/use-tree-data.js";
import { isObject, isUndefined, isFunction } from "../_utils/is.js";
import Empty from "../empty/index.js";
import useFilterTreeNode from "./hooks/use-filter-tree-node.js";
import Spin from "../spin/index.js";
import pickSubCompSlots from "../_utils/pick-sub-comp-slots.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { getCheckedStateByCheck, isNodeCheckable } from "../tree/utils/check-utils.js";
import { isNodeSelectable } from "../tree/utils/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TreeSelect",
  components: {
    Trigger,
    SelectView,
    Panel,
    Empty,
    Spin
  },
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    error: {
      type: Boolean
    },
    size: {
      type: String
    },
    border: {
      type: Boolean,
      default: true
    },
    allowSearch: {
      type: [Boolean, Object],
      default: (props) => Boolean(props.multiple)
    },
    allowClear: {
      type: Boolean
    },
    placeholder: {
      type: String
    },
    maxTagCount: {
      type: Number
    },
    multiple: {
      type: Boolean
    },
    defaultValue: {
      type: [String, Number, Array, Object]
    },
    modelValue: {
      type: [String, Number, Array, Object]
    },
    fieldNames: {
      type: Object
    },
    data: {
      type: Array,
      default: () => []
    },
    labelInValue: {
      type: Boolean
    },
    treeCheckable: {
      type: Boolean
    },
    treeCheckStrictly: {
      type: Boolean
    },
    treeCheckedStrategy: {
      type: String,
      default: "all"
    },
    treeProps: {
      type: Object
    },
    triggerProps: {
      type: Object
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean
    },
    dropdownStyle: {
      type: Object
    },
    dropdownClassName: {
      type: [String, Array]
    },
    filterTreeNode: {
      type: Function
    },
    loadMore: {
      type: Function
    },
    disableFilter: {
      type: Boolean
    },
    popupContainer: {
      type: [String, Object]
    },
    fallbackOption: {
      type: [Boolean, Function],
      default: true
    },
    selectable: {
      type: [Boolean, String, Function],
      default: true
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
    inputValue: {
      type: String
    },
    defaultInputValue: {
      type: String,
      default: ""
    }
  },
  emits: {
    "change": (value) => true,
    "update:modelValue": (value) => true,
    "update:inputValue": (inputValue) => true,
    "popup-visible-change": (visible) => true,
    "update:popupVisible": (visible) => true,
    "search": (searchKey) => true,
    "clear": () => true,
    "inputValueChange": (inputValue) => true
  },
  setup(props, { emit, slots }) {
    var _a, _b, _c;
    const {
      defaultValue,
      modelValue,
      multiple,
      popupVisible,
      defaultPopupVisible,
      treeCheckable,
      treeCheckStrictly,
      data,
      fieldNames,
      disabled,
      labelInValue,
      filterTreeNode,
      disableFilter,
      dropdownStyle,
      treeProps,
      fallbackOption,
      selectable,
      dropdownClassName
    } = toRefs(props);
    const { mergedDisabled, eventHandlers } = useFormItem({
      disabled
    });
    const prefixCls = getPrefixCls("tree-select");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const TreeSelectEmpty = (_c = (_b = configCtx == null ? void 0 : (_a = configCtx.slots).empty) == null ? void 0 : _b.call(_a, {
      component: "tree-select"
    })) == null ? void 0 : _c[0];
    const isMultiple = computed(() => multiple.value || treeCheckable.value);
    const isSelectable = (node, info) => {
      var _a2;
      if (selectable.value === "leaf")
        return info.isLeaf;
      if (isFunction(selectable.value))
        return selectable.value(node, info);
      return (_a2 = selectable.value) != null ? _a2 : false;
    };
    const isCheckable = computed(
      () => treeCheckable.value ? isSelectable : false
    );
    const retainInputValue = computed(
      () => isObject(props.allowSearch) && Boolean(props.allowSearch.retainInputValue)
    );
    const { flattenTreeData, key2TreeNode } = useTreeData(
      reactive({
        treeData: data,
        fieldNames,
        selectable: isSelectable,
        checkable: isCheckable
      })
    );
    const {
      selectedKeys,
      selectedValue,
      setLocalSelectedKeys,
      localSelectedKeys,
      localSelectedValue
    } = useSelectedState(
      reactive({
        defaultValue,
        modelValue,
        key2TreeNode,
        multiple,
        treeCheckable,
        treeCheckStrictly,
        fallbackOption,
        fieldNames
      })
    );
    function isNodeClosable(node) {
      return treeCheckable.value ? isNodeCheckable(node) : isNodeSelectable(node);
    }
    const selectViewValue = computed(() => {
      if (isUndefined(selectedValue.value)) {
        return [];
      }
      if (isMultiple.value && !mergedDisabled.value) {
        return selectedValue.value.map((i) => {
          const node = key2TreeNode.value.get(i.value);
          return {
            ...i,
            closable: !node || isNodeClosable(node)
          };
        });
      }
      return selectedValue.value;
    });
    const setSelectedKeys = (newVal) => {
      setLocalSelectedKeys(newVal);
      nextTick(() => {
        var _a2, _b2;
        const forEmitValue = (labelInValue.value ? localSelectedValue.value : localSelectedKeys.value) || [];
        const emitValue = isMultiple.value ? forEmitValue : forEmitValue[0];
        emit("update:modelValue", emitValue);
        emit("change", emitValue);
        (_b2 = (_a2 = eventHandlers.value) == null ? void 0 : _a2.onChange) == null ? void 0 : _b2.call(_a2);
      });
    };
    const _inputValue = ref(props.defaultInputValue);
    const computedInputValue = computed(
      () => {
        var _a2;
        return (_a2 = props.inputValue) != null ? _a2 : _inputValue.value;
      }
    );
    const updateInputValue = (inputValue) => {
      _inputValue.value = inputValue;
      emit("update:inputValue", inputValue);
      emit("inputValueChange", inputValue);
    };
    const handleInputValueChange = (inputValue) => {
      if (inputValue !== computedInputValue.value) {
        setPanelVisible(true);
        updateInputValue(inputValue);
        if (props.allowSearch) {
          emit("search", inputValue);
        }
      }
    };
    const [panelVisible, setLocalPanelVisible] = useMergeState(
      defaultPopupVisible.value,
      reactive({
        value: popupVisible
      })
    );
    const setPanelVisible = (visible) => {
      if (visible !== panelVisible.value) {
        setLocalPanelVisible(visible);
        emit("popup-visible-change", visible);
        emit("update:popupVisible", visible);
      }
      if (!visible) {
        refSelectView.value && refSelectView.value.blur && refSelectView.value.blur();
      }
    };
    const { isEmptyFilterResult, filterTreeNode: computedFilterTreeNode } = useFilterTreeNode(
      reactive({
        searchValue: computedInputValue,
        flattenTreeData,
        filterMethod: filterTreeNode,
        disableFilter,
        fieldNames
      })
    );
    const isEmpty = computed(
      () => !flattenTreeData.value.length || isEmptyFilterResult.value
    );
    const refSelectView = ref();
    const computedDropdownStyle = computed(() => {
      var _a2;
      return [
        (dropdownStyle == null ? void 0 : dropdownStyle.value) || {},
        ((_a2 = treeProps == null ? void 0 : treeProps.value) == null ? void 0 : _a2.virtualListProps) ? { "max-height": "unset" } : {}
      ];
    });
    const onBlur = () => {
      if (!retainInputValue.value && computedInputValue.value) {
        updateInputValue("");
      }
    };
    return {
      refSelectView,
      prefixCls,
      TreeSelectEmpty,
      selectedValue,
      selectedKeys,
      mergedDisabled,
      searchValue: computedInputValue,
      panelVisible,
      isEmpty,
      computedFilterTreeNode,
      isMultiple,
      selectViewValue,
      computedDropdownStyle,
      onSearchValueChange: handleInputValueChange,
      onSelectChange(newVal) {
        setSelectedKeys(newVal);
        if (!retainInputValue.value && computedInputValue.value) {
          updateInputValue("");
        }
        if (!isMultiple.value) {
          setPanelVisible(false);
        }
      },
      onVisibleChange: setPanelVisible,
      onInnerClear() {
        setSelectedKeys([]);
        emit("clear");
      },
      pickSubCompSlots,
      isSelectable,
      isCheckable,
      onBlur,
      onItemRemove(id) {
        if (mergedDisabled.value)
          return;
        const node = key2TreeNode.value.get(id);
        if (treeCheckable.value && node) {
          if (isNodeClosable(node)) {
            const [newVal] = getCheckedStateByCheck({
              node,
              checked: false,
              checkedKeys: selectedKeys.value,
              indeterminateKeys: [],
              checkStrictly: treeCheckStrictly.value
            });
            setSelectedKeys(newVal);
          }
        } else {
          const newVal = selectedKeys.value.filter((i) => i !== id);
          setSelectedKeys(newVal);
        }
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_SelectView = resolveComponent("SelectView");
  const _component_Spin = resolveComponent("Spin");
  const _component_Panel = resolveComponent("Panel");
  const _component_Trigger = resolveComponent("Trigger");
  return openBlock(), createBlock(_component_Trigger, mergeProps({
    class: `${_ctx.prefixCls}-trigger`,
    "auto-fit-popup-min-width": "",
    trigger: "click",
    position: "bl",
    "popup-offset": 4,
    "animation-name": "slide-dynamic-origin",
    "prevent-focus": true
  }, _ctx.triggerProps, {
    disabled: _ctx.mergedDisabled,
    "popup-visible": _ctx.panelVisible,
    "popup-container": _ctx.popupContainer,
    "click-to-close": !_ctx.allowSearch,
    "auto-fit-transform-origin": "",
    onPopupVisibleChange: _ctx.onVisibleChange
  }), {
    content: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass([
          `${_ctx.prefixCls}-popup`,
          {
            [`${_ctx.prefixCls}-has-header`]: Boolean(_ctx.$slots.header),
            [`${_ctx.prefixCls}-has-footer`]: Boolean(_ctx.$slots.footer)
          },
          _ctx.dropdownClassName
        ]),
        style: normalizeStyle(_ctx.computedDropdownStyle)
      }, [
        _ctx.$slots.header && (!_ctx.isEmpty || _ctx.showHeaderOnEmpty) ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-header`)
        }, [
          renderSlot(_ctx.$slots, "header")
        ], 2)) : createCommentVNode("v-if", true),
        _ctx.loading ? renderSlot(_ctx.$slots, "loader", { key: 1 }, () => [
          createVNode(_component_Spin)
        ]) : _ctx.isEmpty ? renderSlot(_ctx.$slots, "empty", { key: 2 }, () => [
          (openBlock(), createBlock(resolveDynamicComponent(_ctx.TreeSelectEmpty ? _ctx.TreeSelectEmpty : "Empty")))
        ]) : (openBlock(), createBlock(_component_Panel, {
          key: 3,
          "selected-keys": _ctx.selectedKeys,
          "show-checkable": _ctx.treeCheckable,
          scrollbar: _ctx.scrollbar,
          "tree-props": {
            actionOnNodeClick: _ctx.selectable === "leaf" ? "expand" : void 0,
            blockNode: true,
            ..._ctx.treeProps,
            data: _ctx.data,
            checkStrictly: _ctx.treeCheckStrictly,
            checkedStrategy: _ctx.treeCheckedStrategy,
            fieldNames: _ctx.fieldNames,
            multiple: _ctx.multiple,
            loadMore: _ctx.loadMore,
            filterTreeNode: _ctx.computedFilterTreeNode,
            size: _ctx.size,
            checkable: _ctx.isCheckable,
            selectable: _ctx.isSelectable,
            searchValue: _ctx.searchValue
          },
          "tree-slots": _ctx.pickSubCompSlots(_ctx.$slots, "tree"),
          onChange: _ctx.onSelectChange
        }, null, 8, ["selected-keys", "show-checkable", "scrollbar", "tree-props", "tree-slots", "onChange"])),
        _ctx.$slots.footer && (!_ctx.isEmpty || _ctx.showFooterOnEmpty) ? (openBlock(), createElementBlock("div", {
          key: 4,
          class: normalizeClass(`${_ctx.prefixCls}-footer`)
        }, [
          renderSlot(_ctx.$slots, "footer")
        ], 2)) : createCommentVNode("v-if", true)
      ], 6)
    ]),
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "trigger", {}, () => [
        createVNode(_component_SelectView, mergeProps({
          ref: "refSelectView",
          "model-value": _ctx.selectViewValue,
          "input-value": _ctx.searchValue,
          "allow-search": Boolean(_ctx.allowSearch),
          "allow-clear": _ctx.allowClear,
          loading: _ctx.loading,
          size: _ctx.size,
          "max-tag-count": _ctx.maxTagCount,
          disabled: _ctx.mergedDisabled,
          opened: _ctx.panelVisible,
          error: _ctx.error,
          bordered: _ctx.border,
          placeholder: _ctx.placeholder,
          multiple: _ctx.isMultiple
        }, _ctx.$attrs, {
          onInputValueChange: _ctx.onSearchValueChange,
          onClear: _ctx.onInnerClear,
          onRemove: _ctx.onItemRemove,
          onBlur: _ctx.onBlur
        }), createSlots({ _: 2 }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "prefix")
            ]),
            key: "0"
          } : void 0,
          _ctx.$slots.label ? {
            name: "label",
            fn: withCtx((selectedData) => [
              renderSlot(_ctx.$slots, "label", normalizeProps(guardReactiveProps(selectedData)))
            ]),
            key: "1"
          } : void 0
        ]), 1040, ["model-value", "input-value", "allow-search", "allow-clear", "loading", "size", "max-tag-count", "disabled", "opened", "error", "bordered", "placeholder", "multiple", "onInputValueChange", "onClear", "onRemove", "onBlur"])
      ])
    ]),
    _: 3
  }, 16, ["class", "disabled", "popup-visible", "popup-container", "click-to-close", "onPopupVisibleChange"]);
}
var _TreeSelect = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _TreeSelect as default };
