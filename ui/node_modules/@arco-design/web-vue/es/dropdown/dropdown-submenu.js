import { defineComponent, toRefs, resolveComponent, openBlock, createBlock, withCtx, createVNode, normalizeClass, createSlots, renderSlot, mergeProps } from "vue";
import Trigger from "../trigger/index.js";
import DropdownPanel from "./dropdown-panel.js";
import Doption from "./dropdown-option.js";
import IconRight from "../icon/icon-right/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useTrigger } from "../_hooks/use-trigger.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Dsubmenu",
  components: {
    Trigger,
    DropdownPanel,
    DropdownOption: Doption,
    IconRight
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
    const { defaultPopupVisible, popupVisible } = toRefs(props);
    const prefixCls = getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger({
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
  const _component_IconRight = resolveComponent("IconRight");
  const _component_dropdown_option = resolveComponent("dropdown-option");
  const _component_dropdown_panel = resolveComponent("dropdown-panel");
  const _component_Trigger = resolveComponent("Trigger");
  return openBlock(), createBlock(_component_Trigger, {
    "popup-visible": _ctx.computedPopupVisible,
    trigger: _ctx.trigger,
    position: _ctx.position,
    disabled: _ctx.disabled,
    "popup-offset": 4,
    onPopupVisibleChange: _ctx.handlePopupVisibleChange
  }, {
    content: withCtx(() => [
      createVNode(_component_dropdown_panel, {
        class: normalizeClass(`${_ctx.prefixCls}-submenu`)
      }, createSlots({
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "content")
        ]),
        _: 2
      }, [
        _ctx.$slots.footer ? {
          name: "footer",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "footer")
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["class"])
    ]),
    default: withCtx(() => [
      createVNode(_component_dropdown_option, mergeProps(_ctx.optionProps, {
        active: _ctx.computedPopupVisible,
        "uninject-context": ""
      }), createSlots({
        suffix: withCtx(() => [
          renderSlot(_ctx.$slots, "suffix", {}, () => [
            createVNode(_component_IconRight)
          ])
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 2
      }, [
        _ctx.$slots.icon ? {
          name: "icon",
          fn: withCtx(() => [
            renderSlot(_ctx.$slots, "icon")
          ]),
          key: "0"
        } : void 0
      ]), 1040, ["active"])
    ]),
    _: 3
  }, 8, ["popup-visible", "trigger", "position", "disabled", "onPopupVisibleChange"]);
}
var Dsubmenu = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Dsubmenu as default };
