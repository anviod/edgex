"use strict";
var vue = require("vue");
var index = require("../trigger/index.js");
var dropdownPanel = require("./dropdown-panel.js");
var dropdownOption = require("./dropdown-option.js");
var index$1 = require("../icon/icon-right/index.js");
var globalConfig = require("../_utils/global-config.js");
var useTrigger = require("../_hooks/use-trigger.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Dsubmenu",
  components: {
    Trigger: index,
    DropdownPanel: dropdownPanel,
    DropdownOption: dropdownOption,
    IconRight: index$1
  },
  props: {
    value: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    trigger: {
      type: [String, Array],
      default: "click"
    },
    position: {
      type: String,
      default: "rt"
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    optionProps: {
      type: Object
    }
  },
  emits: {
    "update:popupVisible": (visible) => true,
    "popupVisibleChange": (visible) => true
  },
  setup(props, { emit }) {
    const { defaultPopupVisible, popupVisible } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger.useTrigger({
      defaultPopupVisible,
      popupVisible,
      emit
    });
    return {
      prefixCls,
      computedPopupVisible,
      handlePopupVisibleChange
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconRight = vue.resolveComponent("IconRight");
  const _component_dropdown_option = vue.resolveComponent("dropdown-option");
  const _component_dropdown_panel = vue.resolveComponent("dropdown-panel");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return vue.openBlock(), vue.createBlock(_component_Trigger, {
    "popup-visible": _ctx.computedPopupVisible,
    trigger: _ctx.trigger,
    position: _ctx.position,
    disabled: _ctx.disabled,
    "popup-offset": 4,
    onPopupVisibleChange: _ctx.handlePopupVisibleChange
  }, {
    content: vue.withCtx(() => [
      vue.createVNode(_component_dropdown_panel, {
        class: vue.normalizeClass(`${_ctx.prefixCls}-submenu`)
      }, vue.createSlots({
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
      ]), 1032, ["class"])
    ]),
    default: vue.withCtx(() => [
      vue.createVNode(_component_dropdown_option, vue.mergeProps(_ctx.optionProps, {
        active: _ctx.computedPopupVisible,
        "uninject-context": ""
      }), vue.createSlots({
        suffix: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "suffix", {}, () => [
            vue.createVNode(_component_IconRight)
          ])
        ]),
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 2
      }, [
        _ctx.$slots.icon ? {
          name: "icon",
          fn: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "icon")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["active"])
    ]),
    _: 3
  }, 8, ["popup-visible", "trigger", "position", "disabled", "onPopupVisibleChange"]);
}
var Dsubmenu = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Dsubmenu;
