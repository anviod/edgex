"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../trigger/index.js");
var dropdownPanel = require("./dropdown-panel.js");
var useTrigger = require("../_hooks/use-trigger.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Dropdown",
  components: {
    Trigger: index,
    DropdownPanel: dropdownPanel
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
      default: "bottom"
    },
    popupContainer: {
      type: [String, Object]
    },
    popupMaxHeight: {
      type: [Boolean, Number],
      default: true
    },
    hideOnSelect: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:popupVisible": (visible) => true,
    "popupVisibleChange": (visible) => true,
    "select": (value, ev) => true
  },
  setup(props, { emit }) {
    const { defaultPopupVisible, popupVisible, popupMaxHeight } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger.useTrigger({
      defaultPopupVisible,
      popupVisible,
      emit
    });
    const handleOptionClick = (value, ev) => {
      emit("select", value, ev);
      props.hideOnSelect && handlePopupVisibleChange(false);
    };
    vue.provide(
      context.dropdownInjectionKey,
      vue.reactive({
        popupMaxHeight,
        onOptionClick: handleOptionClick
      })
    );
    return {
      prefixCls,
      computedPopupVisible,
      handlePopupVisibleChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DropdownPanel = vue.resolveComponent("DropdownPanel");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return vue.openBlock(), vue.createBlock(_component_Trigger, {
    "popup-visible": _ctx.computedPopupVisible,
    "animation-name": "slide-dynamic-origin",
    "auto-fit-transform-origin": "",
    trigger: _ctx.trigger,
    position: _ctx.position,
    "popup-offset": 4,
    "popup-container": _ctx.popupContainer,
    "opened-class": `${_ctx.prefixCls}-open`,
    onPopupVisibleChange: _ctx.handlePopupVisibleChange
  }, {
    content: vue.withCtx(() => [
      vue.createVNode(_component_DropdownPanel, null, vue.createSlots({
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "content")
        ]),
        _: 2
      }, [
        _ctx.$slots.footer ? {
          name: "footer",
          fn: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "footer")
          ]),
          key: "0"
        } : void 0
      ]), 1024)
    ]),
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["popup-visible", "trigger", "position", "popup-container", "opened-class", "onPopupVisibleChange"]);
}
var _Dropdown = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Dropdown;
