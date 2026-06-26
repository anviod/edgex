"use strict";
var vue = require("vue");
var useMergeState = require("../_hooks/use-merge-state.js");
var index = require("../trigger/index.js");
var selectView = require("../_components/select-view/select-view.js");
var panel = require("./panel.js");
var globalConfig = require("../_utils/global-config.js");
var context = require("../config-provider/context.js");
var useSelectedState = require("./hooks/use-selected-state.js");
var useTreeData = require("../tree/hooks/use-tree-data.js");
var is = require("../_utils/is.js");
var index$1 = require("../empty/index.js");
var useFilterTreeNode = require("./hooks/use-filter-tree-node.js");
var index$2 = require("../spin/index.js");
var pickSubCompSlots = require("../_utils/pick-sub-comp-slots.js");
var useFormItem = require("../_hooks/use-form-item.js");
var checkUtils = require("../tree/utils/check-utils.js");
var index$3 = require("../tree/utils/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TreeSelect",
  components: {
    Trigger: index,
    SelectView: selectView,
    Panel: panel,
    Empty: index$1,
    Spin: index$2
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
    } = vue.toRefs(props);
    const { mergedDisabled, eventHandlers } = useFormItem.useFormItem({
      disabled
    });
    const prefixCls = globalConfig.getPrefixCls("tree-select");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const TreeSelectEmpty = (_c = (_b = configCtx == null ? void 0 : (_a = configCtx.slots).empty) == null ? void 0 : _b.call(_a, {
      component: "tree-select"
    })) == null ? void 0 : _c[0];
    const isMultiple = vue.computed(() => multiple.value || treeCheckable.value);
    const isSelectable = (node, info) => {
      var _a2;
      if (selectable.value === "leaf")
        return info.isLeaf;
      if (is.isFunction(selectable.value))
        return selectable.value(node, info);
      return (_a2 = selectable.value) != null ? _a2 : false;
    };
    const isCheckable = vue.computed(
      () => treeCheckable.value ? isSelectable : false
    );
    const retainInputValue = vue.computed(
      () => is.isObject(props.allowSearch) && Boolean(props.allowSearch.retainInputValue)
    );
    const { flattenTreeData, key2TreeNode } = useTreeData(
      vue.reactive({
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
      vue.reactive({
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
      return treeCheckable.value ? checkUtils.isNodeCheckable(node) : index$3.isNodeSelectable(node);
    }
    const selectViewValue = vue.computed(() => {
      if (is.isUndefined(selectedValue.value)) {
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
      vue.nextTick(() => {
        var _a2, _b2;
        const forEmitValue = (labelInValue.value ? localSelectedValue.value : localSelectedKeys.value) || [];
        const emitValue = isMultiple.value ? forEmitValue : forEmitValue[0];
        emit("update:modelValue", emitValue);
        emit("change", emitValue);
        (_b2 = (_a2 = eventHandlers.value) == null ? void 0 : _a2.onChange) == null ? void 0 : _b2.call(_a2);
      });
    };
    const _inputValue = vue.ref(props.defaultInputValue);
    const computedInputValue = vue.computed(
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
      vue.reactive({
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
      vue.reactive({
        searchValue: computedInputValue,
        flattenTreeData,
        filterMethod: filterTreeNode,
        disableFilter,
        fieldNames
      })
    );
    const isEmpty = vue.computed(
      () => !flattenTreeData.value.length || isEmptyFilterResult.value
    );
    const refSelectView = vue.ref();
    const computedDropdownStyle = vue.computed(() => {
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
            const [newVal] = checkUtils.getCheckedStateByCheck({
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
  const _component_SelectView = vue.resolveComponent("SelectView");
  const _component_Spin = vue.resolveComponent("Spin");
  const _component_Panel = vue.resolveComponent("Panel");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return vue.openBlock(), vue.createBlock(_component_Trigger, vue.mergeProps({
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
    content: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass([
          `${_ctx.prefixCls}-popup`,
          {
            [`${_ctx.prefixCls}-has-header`]: Boolean(_ctx.$slots.header),
            [`${_ctx.prefixCls}-has-footer`]: Boolean(_ctx.$slots.footer)
          },
          _ctx.dropdownClassName
        ]),
        style: vue.normalizeStyle(_ctx.computedDropdownStyle)
      }, [
        _ctx.$slots.header && (!_ctx.isEmpty || _ctx.showHeaderOnEmpty) ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
        }, [
          vue.renderSlot(_ctx.$slots, "header")
        ], 2)) : vue.createCommentVNode("v-if", true),
        _ctx.loading ? vue.renderSlot(_ctx.$slots, "loader", { key: 1 }, () => [
          vue.createVNode(_component_Spin)
        ]) : _ctx.isEmpty ? vue.renderSlot(_ctx.$slots, "empty", { key: 2 }, () => [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.TreeSelectEmpty ? _ctx.TreeSelectEmpty : "Empty")))
        ]) : (vue.openBlock(), vue.createBlock(_component_Panel, {
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
        _ctx.$slots.footer && (!_ctx.isEmpty || _ctx.showFooterOnEmpty) ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 4,
          class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
        }, [
          vue.renderSlot(_ctx.$slots, "footer")
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 6)
    ]),
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "trigger", {}, () => [
        vue.createVNode(_component_SelectView, vue.mergeProps({
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
        }), vue.createSlots({ _: 2 }, [
          _ctx.$slots.prefix ? {
            name: "prefix",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "prefix")
            ]),
            key: "0"
          } : void 0,
          _ctx.$slots.label ? {
            name: "label",
            fn: vue.withCtx((selectedData) => [
              vue.renderSlot(_ctx.$slots, "label", vue.normalizeProps(vue.guardReactiveProps(selectedData)))
            ]),
            key: "1"
          } : void 0
        ]), 1040, ["model-value", "input-value", "allow-search", "allow-clear", "loading", "size", "max-tag-count", "disabled", "opened", "error", "bordered", "placeholder", "multiple", "onInputValueChange", "onClear", "onRemove", "onBlur"])
      ])
    ]),
    _: 3
  }, 16, ["class", "disabled", "popup-visible", "popup-container", "click-to-close", "onPopupVisibleChange"]);
}
var _TreeSelect = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _TreeSelect;
