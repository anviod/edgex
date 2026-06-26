import { defineComponent, ref, inject, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, toDisplayString, createBlock, withCtx, createTextVNode, createVNode, createCommentVNode, mergeProps, Fragment, renderList } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Checkbox from "../checkbox/index.js";
import IconHover from "../_components/icon-hover.js";
import IconDelete from "../icon/icon-delete/index.js";
import Input from "../input/index.js";
import List from "../list/index.js";
import TransferListItem from "./transfer-list-item.js";
import { transferInjectionKey } from "./context.js";
import Scrollbar from "../scrollbar/index.js";
import Empty from "../empty/empty.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TransferView",
  components: {
    Empty,
    Checkbox,
    IconHover,
    IconDelete,
    InputSearch: Input.Search,
    List,
    TransferListItem,
    Scrollbar
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
    const prefixCls = getPrefixCls("transfer-view");
    const filter = ref("");
    const transferCtx = inject(transferInjectionKey, void 0);
    const countSelected = computed(() => props.dataInfo.selected.length);
    const countRendered = computed(() => props.dataInfo.data.length);
    const checked = computed(
      () => props.dataInfo.selected.length > 0 && props.dataInfo.selected.length === props.dataInfo.allValidValues.length
    );
    const indeterminate = computed(
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
    const filteredData = computed(
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
  const _component_checkbox = resolveComponent("checkbox");
  const _component_icon_delete = resolveComponent("icon-delete");
  const _component_icon_hover = resolveComponent("icon-hover");
  const _component_input_search = resolveComponent("input-search");
  const _component_transfer_list_item = resolveComponent("transfer-list-item");
  const _component_list = resolveComponent("list");
  const _component_Scrollbar = resolveComponent("Scrollbar");
  const _component_Empty = resolveComponent("Empty");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-header`)
    }, [
      renderSlot(_ctx.$slots, "title", {
        countTotal: _ctx.dataInfo.data.length,
        countSelected: _ctx.dataInfo.selected.length,
        searchValue: _ctx.filter,
        checked: _ctx.checked,
        indeterminate: _ctx.indeterminate,
        onSelectAllChange: _ctx.handleSelectAllChange,
        onClear: _ctx.handleClear
      }, () => [
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.prefixCls}-header-title`)
        }, [
          _ctx.allowClear || _ctx.simple || !_ctx.showSelectAll ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-header-title-simple`)
          }, toDisplayString(_ctx.title), 3)) : (openBlock(), createBlock(_component_checkbox, {
            key: 1,
            "model-value": _ctx.checked,
            indeterminate: _ctx.indeterminate,
            disabled: _ctx.disabled,
            "uninject-group-context": "",
            onChange: _ctx.handleSelectAllChange
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ]),
            _: 1
          }, 8, ["model-value", "indeterminate", "disabled", "onChange"]))
        ], 2),
        _ctx.allowClear ? (openBlock(), createBlock(_component_icon_hover, {
          key: 0,
          disabled: _ctx.disabled,
          class: normalizeClass(`${_ctx.prefixCls}-header-clear-btn`),
          onClick: _ctx.handleClear
        }, {
          default: withCtx(() => [
            createVNode(_component_icon_delete)
          ]),
          _: 1
        }, 8, ["disabled", "class", "onClick"])) : !_ctx.simple ? (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(`${_ctx.prefixCls}-header-count`)
        }, toDisplayString(_ctx.dataInfo.selected.length) + " / " + toDisplayString(_ctx.dataInfo.data.length), 3)) : createCommentVNode("v-if", true)
      ])
    ], 2),
    _ctx.showSearch ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-search`)
    }, [
      createVNode(_component_input_search, mergeProps({
        modelValue: _ctx.filter,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.filter = $event),
        disabled: _ctx.disabled
      }, _ctx.inputSearchProps, { onChange: _ctx.handleSearch }), null, 16, ["modelValue", "disabled", "onChange"])
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-body`)
    }, [
      _ctx.filteredData.length > 0 ? (openBlock(), createBlock(_component_Scrollbar, { key: 0 }, {
        default: withCtx(() => {
          var _a, _b;
          return [
            renderSlot(_ctx.$slots, "default", {
              data: _ctx.filteredData,
              selectedKeys: (_a = _ctx.transferCtx) == null ? void 0 : _a.selected,
              onSelect: (_b = _ctx.transferCtx) == null ? void 0 : _b.onSelect
            }, () => [
              createVNode(_component_list, {
                class: normalizeClass(`${_ctx.prefixCls}-list`),
                bordered: false,
                scrollbar: false
              }, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filteredData, (item) => {
                    return openBlock(), createBlock(_component_transfer_list_item, {
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
      })) : (openBlock(), createBlock(_component_Empty, {
        key: 1,
        class: normalizeClass(`${_ctx.prefixCls}-empty`)
      }, null, 8, ["class"]))
    ], 2)
  ], 2);
}
var TransferView = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { TransferView as default };
