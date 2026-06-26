"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../button/index.js");
var transferView = require("./transfer-view.js");
var index$1 = require("../icon/icon-left/index.js");
var index$2 = require("../icon/icon-right/index.js");
var context = require("./context.js");
var useFormItem = require("../_hooks/use-form-item.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Transfer",
  components: {
    ArcoButton: index["default"],
    TransferView: transferView,
    IconLeft: index$1,
    IconRight: index$2
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
    const { mergedDisabled, eventHandlers } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const prefixCls = globalConfig.getPrefixCls("transfer");
    const _target = vue.ref(props.defaultValue);
    const computedTarget = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _target.value;
    });
    const _selected = vue.ref(props.defaultSelected);
    const computedSelected = vue.computed(() => {
      var _a;
      return (_a = props.selected) != null ? _a : _selected.value;
    });
    const sourceTitle = vue.computed(() => {
      var _a;
      return (_a = props.title) == null ? void 0 : _a[0];
    });
    const targetTitle = vue.computed(() => {
      var _a;
      return (_a = props.title) == null ? void 0 : _a[1];
    });
    const dataInfo = vue.computed(() => {
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
    vue.provide(
      context.transferInjectionKey,
      vue.reactive({
        selected: computedSelected,
        slots,
        moveTo,
        onSelect: handleSelect
      })
    );
    const cls = vue.computed(() => [
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
  const _component_transfer_view = vue.resolveComponent("transfer-view");
  const _component_icon_right = vue.resolveComponent("icon-right");
  const _component_arco_button = vue.resolveComponent("arco-button");
  const _component_icon_left = vue.resolveComponent("icon-left");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createVNode(_component_transfer_view, {
      type: "source",
      class: vue.normalizeClass(`${_ctx.prefixCls}-view-source`),
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
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.source ? {
        name: "default",
        fn: vue.withCtx((slotData) => [
          vue.renderSlot(_ctx.$slots, "source", vue.normalizeProps(vue.guardReactiveProps(slotData)))
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots["source-title"] ? {
        name: "title",
        fn: vue.withCtx((titleProps) => [
          vue.renderSlot(_ctx.$slots, "source-title", vue.normalizeProps(vue.guardReactiveProps(titleProps)))
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["class", "title", "data-info", "data", "disabled", "selected", "show-search", "show-select-all", "simple", "input-search-props", "onSearch"]),
    !_ctx.simple ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass([`${_ctx.prefixCls}-operations`])
    }, [
      vue.createVNode(_component_arco_button, {
        tabindex: "-1",
        "aria-label": "Move selected right",
        size: "small",
        shape: "round",
        disabled: _ctx.dataInfo.sourceInfo.validSelected.length === 0,
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleClick("target"))
      }, {
        icon: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "to-target-icon", {}, () => [
            vue.createVNode(_component_icon_right)
          ])
        ]),
        _: 3
      }, 8, ["disabled"]),
      !_ctx.oneWay ? (vue.openBlock(), vue.createBlock(_component_arco_button, {
        key: 0,
        tabindex: "-1",
        "aria-label": "Move selected left",
        size: "small",
        shape: "round",
        disabled: _ctx.dataInfo.targetInfo.validSelected.length === 0,
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.handleClick("source"))
      }, {
        icon: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "to-source-icon", {}, () => [
            vue.createVNode(_component_icon_left)
          ])
        ]),
        _: 3
      }, 8, ["disabled"])) : vue.createCommentVNode("v-if", true)
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createVNode(_component_transfer_view, {
      type: "target",
      class: vue.normalizeClass(`${_ctx.prefixCls}-view-target`),
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
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.target ? {
        name: "default",
        fn: vue.withCtx((slotData) => [
          vue.renderSlot(_ctx.$slots, "target", vue.normalizeProps(vue.guardReactiveProps(slotData)))
        ]),
        key: "0"
      } : void 0,
      _ctx.$slots["target-title"] ? {
        name: "title",
        fn: vue.withCtx((titleProps) => [
          vue.renderSlot(_ctx.$slots, "target-title", vue.normalizeProps(vue.guardReactiveProps(titleProps)))
        ]),
        key: "1"
      } : void 0
    ]), 1032, ["class", "title", "data-info", "data", "disabled", "selected", "allow-clear", "show-search", "show-select-all", "simple", "input-search-props", "onSearch"])
  ], 2);
}
var _Transfer = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Transfer;
