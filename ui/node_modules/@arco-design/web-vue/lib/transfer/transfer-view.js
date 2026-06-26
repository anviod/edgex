"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../checkbox/index.js");
var iconHover = require("../_components/icon-hover.js");
var index$1 = require("../icon/icon-delete/index.js");
var index$2 = require("../input/index.js");
var index$3 = require("../list/index.js");
var transferListItem = require("./transfer-list-item.js");
var context = require("./context.js");
var index$4 = require("../scrollbar/index.js");
var empty = require("../empty/empty.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TransferView",
  components: {
    Empty: empty,
    Checkbox: index["default"],
    IconHover: iconHover,
    IconDelete: index$1,
    InputSearch: index$2["default"].Search,
    List: index$3["default"],
    TransferListItem: transferListItem,
    Scrollbar: index$4
  },
  props: {
    type: {
      type: String
    },
    dataInfo: {
      type: Object,
      required: true
    },
    title: String,
    data: {
      type: Array,
      required: true
    },
    disabled: Boolean,
    allowClear: Boolean,
    selected: {
      type: Array,
      required: true
    },
    showSearch: Boolean,
    showSelectAll: Boolean,
    simple: Boolean,
    inputSearchProps: {
      type: Object
    }
  },
  emits: ["search"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("transfer-view");
    const filter = vue.ref("");
    const transferCtx = vue.inject(context.transferInjectionKey, void 0);
    const countSelected = vue.computed(() => props.dataInfo.selected.length);
    const countRendered = vue.computed(() => props.dataInfo.data.length);
    const checked = vue.computed(
      () => props.dataInfo.selected.length > 0 && props.dataInfo.selected.length === props.dataInfo.allValidValues.length
    );
    const indeterminate = vue.computed(
      () => props.dataInfo.selected.length > 0 && props.dataInfo.selected.length < props.dataInfo.allValidValues.length
    );
    const handleSelectAllChange = (checked2) => {
      if (checked2) {
        transferCtx == null ? void 0 : transferCtx.onSelect([
          ...props.selected,
          ...props.dataInfo.allValidValues
        ]);
      } else {
        transferCtx == null ? void 0 : transferCtx.onSelect(
          props.selected.filter(
            (value) => !props.dataInfo.allValidValues.includes(value)
          )
        );
      }
    };
    const filteredData = vue.computed(
      () => props.dataInfo.data.filter((item) => {
        if (filter.value) {
          return item.label.includes(filter.value);
        }
        return true;
      })
    );
    const handleSearch = (value) => {
      emit("search", value, props.type);
    };
    const handleClear = () => {
      transferCtx == null ? void 0 : transferCtx.moveTo(props.dataInfo.allValidValues, "source");
    };
    return {
      prefixCls,
      filteredData,
      filter,
      checked,
      indeterminate,
      countSelected,
      countRendered,
      handleSelectAllChange,
      handleSearch,
      handleClear,
      transferCtx
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_checkbox = vue.resolveComponent("checkbox");
  const _component_icon_delete = vue.resolveComponent("icon-delete");
  const _component_icon_hover = vue.resolveComponent("icon-hover");
  const _component_input_search = vue.resolveComponent("input-search");
  const _component_transfer_list_item = vue.resolveComponent("transfer-list-item");
  const _component_list = vue.resolveComponent("list");
  const _component_Scrollbar = vue.resolveComponent("Scrollbar");
  const _component_Empty = vue.resolveComponent("Empty");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
    }, [
      vue.renderSlot(_ctx.$slots, "title", {
        countTotal: _ctx.dataInfo.data.length,
        countSelected: _ctx.dataInfo.selected.length,
        searchValue: _ctx.filter,
        checked: _ctx.checked,
        indeterminate: _ctx.indeterminate,
        onSelectAllChange: _ctx.handleSelectAllChange,
        onClear: _ctx.handleClear
      }, () => [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-header-title`)
        }, [
          _ctx.allowClear || _ctx.simple || !_ctx.showSelectAll ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-header-title-simple`)
          }, vue.toDisplayString(_ctx.title), 3)) : (vue.openBlock(), vue.createBlock(_component_checkbox, {
            key: 1,
            "model-value": _ctx.checked,
            indeterminate: _ctx.indeterminate,
            disabled: _ctx.disabled,
            "uninject-group-context": "",
            onChange: _ctx.handleSelectAllChange
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ]),
            _: 1
          }, 8, ["model-value", "indeterminate", "disabled", "onChange"]))
        ], 2),
        _ctx.allowClear ? (vue.openBlock(), vue.createBlock(_component_icon_hover, {
          key: 0,
          disabled: _ctx.disabled,
          class: vue.normalizeClass(`${_ctx.prefixCls}-header-clear-btn`),
          onClick: _ctx.handleClear
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_icon_delete)
          ]),
          _: 1
        }, 8, ["disabled", "class", "onClick"])) : !_ctx.simple ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 1,
          class: vue.normalizeClass(`${_ctx.prefixCls}-header-count`)
        }, vue.toDisplayString(_ctx.dataInfo.selected.length) + " / " + vue.toDisplayString(_ctx.dataInfo.data.length), 3)) : vue.createCommentVNode("v-if", true)
      ])
    ], 2),
    _ctx.showSearch ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-search`)
    }, [
      vue.createVNode(_component_input_search, vue.mergeProps({
        modelValue: _ctx.filter,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.filter = $event),
        disabled: _ctx.disabled
      }, _ctx.inputSearchProps, { onChange: _ctx.handleSearch }), null, 16, ["modelValue", "disabled", "onChange"])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-body`)
    }, [
      _ctx.filteredData.length > 0 ? (vue.openBlock(), vue.createBlock(_component_Scrollbar, { key: 0 }, {
        default: vue.withCtx(() => {
          var _a, _b;
          return [
            vue.renderSlot(_ctx.$slots, "default", {
              data: _ctx.filteredData,
              selectedKeys: (_a = _ctx.transferCtx) == null ? void 0 : _a.selected,
              onSelect: (_b = _ctx.transferCtx) == null ? void 0 : _b.onSelect
            }, () => [
              vue.createVNode(_component_list, {
                class: vue.normalizeClass(`${_ctx.prefixCls}-list`),
                bordered: false,
                scrollbar: false
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.filteredData, (item) => {
                    return vue.openBlock(), vue.createBlock(_component_transfer_list_item, {
                      key: item.value,
                      type: _ctx.type,
                      data: item,
                      simple: _ctx.simple,
                      "allow-clear": _ctx.allowClear,
                      disabled: _ctx.disabled || item.disabled
                    }, null, 8, ["type", "data", "simple", "allow-clear", "disabled"]);
                  }), 128))
                ]),
                _: 1
              }, 8, ["class"])
            ])
          ];
        }),
        _: 3
      })) : (vue.openBlock(), vue.createBlock(_component_Empty, {
        key: 1,
        class: vue.normalizeClass(`${_ctx.prefixCls}-empty`)
      }, null, 8, ["class"]))
    ], 2)
  ], 2);
}
var TransferView = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TransferView;
