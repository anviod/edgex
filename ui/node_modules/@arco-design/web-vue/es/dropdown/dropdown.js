import { defineComponent, toRefs, provide, reactive, resolveComponent, openBlock, createBlock, withCtx, createVNode, createSlots, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Trigger from "../trigger/index.js";
import DropdownPanel from "./dropdown-panel.js";
import { useTrigger } from "../_hooks/use-trigger.js";
import { dropdownInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Dropdown",
  components: {
    Trigger,
    DropdownPanel
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
    const { defaultPopupVisible, popupVisible, popupMaxHeight } = toRefs(props);
    const prefixCls = getPrefixCls("dropdown");
    const { computedPopupVisible, handlePopupVisibleChange } = useTrigger({
      defaultPopupVisible,
      popupVisible,
      emit
    });
    const handleOptionClick = (value, ev) => {
      emit("select", value, ev);
      props.hideOnSelect && handlePopupVisibleChange(false);
    };
    provide(
      dropdownInjectionKey,
      reactive({
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
  const _component_DropdownPanel = resolveComponent("DropdownPanel");
  const _component_Trigger = resolveComponent("Trigger");
  return openBlock(), createBlock(_component_Trigger, {
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
    content: withCtx(() => [
      createVNode(_component_DropdownPanel, null, createSlots({
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
      ]), 1024)
    ]),
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["popup-visible", "trigger", "position", "popup-container", "opened-class", "onPopupVisibleChange"]);
}
var _Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Dropdown as default };
