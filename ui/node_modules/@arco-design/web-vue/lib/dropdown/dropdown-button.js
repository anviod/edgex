"use strict";
var vue = require("vue");
var index = require("../icon/icon-more/index.js");
var index$1 = require("../button/index.js");
var dropdown = require("./dropdown.js");
var globalConfig = require("../_utils/global-config.js");
var useTrigger = require("../_hooks/use-trigger.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
var buttonGroup = require("../button/button-group.js");
const _sfc_main = vue.defineComponent({
  name: "DropdownButton",
  components: {
    IconMore: index,
    Button: index$1["default"],
    ButtonGroup: buttonGroup,
    Dropdown: dropdown
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
    const { defaultPopupVisible, popupVisible } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger.useTrigger({
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
  const _component_Button = vue.resolveComponent("Button");
  const _component_IconMore = vue.resolveComponent("IconMore");
  const _component_Dropdown = vue.resolveComponent("Dropdown");
  const _component_ButtonGroup = vue.resolveComponent("ButtonGroup");
  return vue.openBlock(), vue.createBlock(_component_ButtonGroup, null, {
    default: vue.withCtx(() => [
      vue.createVNode(_component_Button, vue.mergeProps({
        size: _ctx.size,
        type: _ctx.type,
        disabled: _ctx.disabled
      }, _ctx.buttonProps, { onClick: _ctx.handleClick }), {
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 3
      }, 16, ["size", "type", "disabled", "onClick"]),
      vue.createVNode(_component_Dropdown, {
        "popup-visible": _ctx.computedPopupVisible,
        trigger: _ctx.trigger,
        position: _ctx.position,
        "popup-container": _ctx.popupContainer,
        "hide-on-select": _ctx.hideOnSelect,
        onSelect: _ctx.handleSelect,
        onPopupVisibleChange: _ctx.handlePopupVisibleChange
      }, {
        content: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "content")
        ]),
        default: vue.withCtx(() => [
          vue.createVNode(_component_Button, {
            size: _ctx.size,
            type: _ctx.type,
            disabled: _ctx.disabled
          }, {
            icon: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "icon", { popupVisible: _ctx.computedPopupVisible }, () => [
                vue.createVNode(_component_IconMore)
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
var DropdownButton = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = DropdownButton;
