import { defineComponent, toRefs, resolveComponent, openBlock, createBlock, withCtx, createVNode, mergeProps, renderSlot } from "vue";
import IconMore from "../icon/icon-more/index.js";
import Button from "../button/index.js";
import _Dropdown from "./dropdown.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useTrigger } from "../_hooks/use-trigger.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
import ButtonGroup from "../button/button-group.js";
const _sfc_main = defineComponent({
  name: "DropdownButton",
  components: {
    IconMore,
    Button,
    ButtonGroup,
    Dropdown: _Dropdown
  },
  props: {
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: [String, Array],
      default: "click"
    },
    position: {
      type: String,
      default: "br"
    },
    popupContainer: {
      type: [String, Object]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    },
    size: {
      type: String
    },
    buttonProps: {
      type: Object
    },
    hideOnSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:popupVisible": (visible) => true,
    "popupVisibleChange": (visible) => true,
    "click": (ev) => true,
    "select": (value, ev) => true
  },
  setup(props, { emit }) {
    const { defaultPopupVisible, popupVisible } = toRefs(props);
    const prefixCls = getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger({
      defaultPopupVisible,
      popupVisible,
      emit
    });
    const handleClick = (ev) => {
      emit("click", ev);
    };
    const handleSelect = (value, ev) => {
      emit("select", value, ev);
    };
    return {
      prefixCls,
      computedPopupVisible,
      handleClick,
      handleSelect,
      handlePopupVisibleChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  const _component_IconMore = resolveComponent("IconMore");
  const _component_Dropdown = resolveComponent("Dropdown");
  const _component_ButtonGroup = resolveComponent("ButtonGroup");
  return openBlock(), createBlock(_component_ButtonGroup, null, {
    default: withCtx(() => [
      createVNode(_component_Button, mergeProps({
        size: _ctx.size,
        type: _ctx.type,
        disabled: _ctx.disabled
      }, _ctx.buttonProps, { onClick: _ctx.handleClick }), {
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["size", "type", "disabled", "onClick"]),
      createVNode(_component_Dropdown, {
        "popup-visible": _ctx.computedPopupVisible,
        trigger: _ctx.trigger,
        position: _ctx.position,
        "popup-container": _ctx.popupContainer,
        "hide-on-select": _ctx.hideOnSelect,
        onSelect: _ctx.handleSelect,
        onPopupVisibleChange: _ctx.handlePopupVisibleChange
      }, {
        content: withCtx(() => [
          renderSlot(_ctx.$slots, "content")
        ]),
        default: withCtx(() => [
          createVNode(_component_Button, {
            size: _ctx.size,
            type: _ctx.type,
            disabled: _ctx.disabled
          }, {
            icon: withCtx(() => [
              renderSlot(_ctx.$slots, "icon", { popupVisible: _ctx.computedPopupVisible }, () => [
                createVNode(_component_IconMore)
              ])
            ]),
            _: 3
          }, 8, ["size", "type", "disabled"])
        ]),
        _: 3
      }, 8, ["popup-visible", "trigger", "position", "popup-container", "hide-on-select", "onSelect", "onPopupVisibleChange"])
    ]),
    _: 3
  });
}
var DropdownButton = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DropdownButton as default };
