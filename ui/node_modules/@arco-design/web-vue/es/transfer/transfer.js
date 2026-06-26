import { defineComponent, toRef, ref, computed, provide, reactive, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, createSlots, withCtx, renderSlot, normalizeProps, guardReactiveProps, createBlock, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Button from "../button/index.js";
import TransferView from "./transfer-view.js";
import IconLeft from "../icon/icon-left/index.js";
import IconRight from "../icon/icon-right/index.js";
import { transferInjectionKey } from "./context.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Transfer",
  components: {
    ArcoButton: Button,
    TransferView,
    IconLeft,
    IconRight
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Array,
      default: void 0
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: void 0
    },
    defaultSelected: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: false
    },
    oneWay: {
      type: Boolean,
      default: false
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showSelectAll: {
      type: Boolean,
      default: true
    },
    title: {
      type: Array,
      default: () => ["Source", "Target"]
    },
    sourceInputSearchProps: {
      type: Object
    },
    targetInputSearchProps: {
      type: Object
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "update:selected": (selected) => true,
    "change": (value) => true,
    "select": (selected) => true,
    "search": (value, type) => true
  },
  setup(props, { emit, slots }) {
    const { mergedDisabled, eventHandlers } = useFormItem({
      disabled: toRef(props, "disabled")
    });
    const prefixCls = getPrefixCls("transfer");
    const _target = ref(props.defaultValue);
    const computedTarget = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _target.value;
    });
    const _selected = ref(props.defaultSelected);
    const computedSelected = computed(() => {
      var _a;
      return (_a = props.selected) != null ? _a : _selected.value;
    });
    const sourceTitle = computed(() => {
      var _a;
      return (_a = props.title) == null ? void 0 : _a[0];
    });
    const targetTitle = computed(() => {
      var _a;
      return (_a = props.title) == null ? void 0 : _a[1];
    });
    const dataInfo = computed(() => {
      const sourceInfo = {
        data: [],
        allValidValues: [],
        selected: [],
        validSelected: []
      };
      const targetInfo = {
        data: [],
        allValidValues: [],
        selected: [],
        validSelected: []
      };
      for (const item of props.data) {
        if (computedTarget.value.includes(item.value)) {
          targetInfo.data.push(item);
          if (!item.disabled) {
            targetInfo.allValidValues.push(item.value);
          }
          if (computedSelected.value.includes(item.value)) {
            targetInfo.selected.push(item.value);
            if (!item.disabled) {
              targetInfo.validSelected.push(item.value);
            }
          }
        } else {
          sourceInfo.data.push(item);
          if (!item.disabled) {
            sourceInfo.allValidValues.push(item.value);
          }
          if (computedSelected.value.includes(item.value)) {
            sourceInfo.selected.push(item.value);
            if (!item.disabled) {
              sourceInfo.validSelected.push(item.value);
            }
          }
        }
      }
      return {
        sourceInfo,
        targetInfo
      };
    });
    const handleSearch = (value, type) => {
      emit("search", value, type);
    };
    const moveTo = (values, target) => {
      var _a, _b;
      const newTarget = target === "target" ? [...computedTarget.value, ...values] : computedTarget.value.filter((value) => !values.includes(value));
      handleSelect(
        dataInfo.value[target === "target" ? "targetInfo" : "sourceInfo"].selected
      );
      _target.value = newTarget;
      emit("update:modelValue", newTarget);
      emit("change", newTarget);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
    };
    const handleClick = (target) => {
      const values = target === "target" ? dataInfo.value.sourceInfo.validSelected : dataInfo.value.targetInfo.validSelected;
      moveTo(values, target);
    };
    const handleSelect = (values) => {
      _selected.value = values;
      emit("update:selected", values);
      emit("select", values);
    };
    provide(
      transferInjectionKey,
      reactive({
        selected: computedSelected,
        slots,
        moveTo,
        onSelect: handleSelect
      })
    );
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-simple`]: props.simple,
        [`${prefixCls}-disabled`]: mergedDisabled.value
      }
    ]);
    return {
      prefixCls,
      cls,
      dataInfo,
      computedSelected,
      mergedDisabled,
      sourceTitle,
      targetTitle,
      handleClick,
      handleSearch
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_transfer_view = resolveComponent("transfer-view");
  const _component_icon_right = resolveComponent("icon-right");
  const _component_arco_button = resolveComponent("arco-button");
  const _component_icon_left = resolveComponent("icon-left");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    createVNode(_component_transfer_view, {
      type: "source",
      class: normalizeClass(`${_ctx.prefixCls}-view-source`),
      title: _ctx.sourceTitle,
      "data-info": _ctx.dataInfo.sourceInfo,
      data: _ctx.dataInfo.sourceInfo.data,
      disabled: _ctx.mergedDisabled,
      selected: _ctx.computedSelected,
      "show-search": _ctx.showSearch,
      "show-select-all": _ctx.showSelectAll,
      simple: _ctx.simple,
      "input-search-props": _ctx.sourceInputSearchProps,
      onSearch: _ctx.handleSearch
    }, createSlots({ _: 2 }, [
      _ctx.$slots.source ? {
        name: "default",
        fn: withCtx((slotData) => [
          renderSlot(_ctx.$slots, "source", normalizeProps(guardReactiveProps(slotData)))
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots["source-title"] ? {
        name: "title",
        fn: withCtx((titleProps) => [
          renderSlot(_ctx.$slots, "source-title", normalizeProps(guardReactiveProps(titleProps)))
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["class", "title", "data-info", "data", "disabled", "selected", "show-search", "show-select-all", "simple", "input-search-props", "onSearch"]),
    !_ctx.simple ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass([`${_ctx.prefixCls}-operations`])
    }, [
      createVNode(_component_arco_button, {
        tabindex: "-1",
        "aria-label": "Move selected right",
        size: "small",
        shape: "round",
        disabled: _ctx.dataInfo.sourceInfo.validSelected.length === 0,
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleClick("target"))
      }, {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "to-target-icon", {}, () => [
            createVNode(_component_icon_right)
          ])
        ]),
        _: 3
      }, 8, ["disabled"]),
      !_ctx.oneWay ? (openBlock(), createBlock(_component_arco_button, {
        key: 0,
        tabindex: "-1",
        "aria-label": "Move selected left",
        size: "small",
        shape: "round",
        disabled: _ctx.dataInfo.targetInfo.validSelected.length === 0,
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleClick("source"))
      }, {
        icon: withCtx(() => [
          renderSlot(_ctx.$slots, "to-source-icon", {}, () => [
            createVNode(_component_icon_left)
          ])
        ]),
        _: 3
      }, 8, ["disabled"])) : createCommentVNode("v-if", true)
    ], 2)) : createCommentVNode("v-if", true),
    createVNode(_component_transfer_view, {
      type: "target",
      class: normalizeClass(`${_ctx.prefixCls}-view-target`),
      title: _ctx.targetTitle,
      "data-info": _ctx.dataInfo.targetInfo,
      data: _ctx.dataInfo.targetInfo.data,
      disabled: _ctx.mergedDisabled,
      selected: _ctx.computedSelected,
      "allow-clear": _ctx.oneWay,
      "show-search": _ctx.showSearch,
      "show-select-all": _ctx.showSelectAll,
      simple: _ctx.simple,
      "input-search-props": _ctx.targetInputSearchProps,
      onSearch: _ctx.handleSearch
    }, createSlots({ _: 2 }, [
      _ctx.$slots.target ? {
        name: "default",
        fn: withCtx((slotData) => [
          renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps(slotData)))
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots["target-title"] ? {
        name: "title",
        fn: withCtx((titleProps) => [
          renderSlot(_ctx.$slots, "target-title", normalizeProps(guardReactiveProps(titleProps)))
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["class", "title", "data-info", "data", "disabled", "selected", "allow-clear", "show-search", "show-select-all", "simple", "input-search-props", "onSearch"])
  ], 2);
}
var _Transfer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Transfer as default };
