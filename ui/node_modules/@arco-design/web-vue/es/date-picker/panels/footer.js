import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createVNode, withCtx, createTextVNode, toDisplayString, createBlock } from "vue";
import Link from "../../link/index.js";
import Button from "../../button/index.js";
import useDatePickerTransform from "../hooks/use-inject-datepicker-transform.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PanelFooter",
  components: {
    Link,
    Button
  },
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    showTodayBtn: {
      type: Boolean
    },
    showConfirmBtn: {
      type: Boolean
    },
    confirmBtnDisabled: {
      type: Boolean
    }
  },
  emits: ["today-btn-click", "confirm-btn-click"],
  setup(_, { emit }) {
    const datePickerT = useDatePickerTransform();
    return {
      datePickerT,
      onTodayClick: () => {
        emit("today-btn-click");
      },
      onConfirmBtnClick: () => {
        emit("confirm-btn-click");
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Link = resolveComponent("Link");
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-footer`)
  }, [
    _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-footer-extra-wrapper`)
    }, [
      renderSlot(_ctx.$slots, "extra")
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.showTodayBtn ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-footer-now-wrapper`)
    }, [
      createVNode(_component_Link, { onClick: _ctx.onTodayClick }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.datePickerT("datePicker.today")), 1)
        ]),
        _: 1
      }, 8, ["onClick"])
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.$slots.btn || _ctx.showConfirmBtn ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-footer-btn-wrapper`)
    }, [
      renderSlot(_ctx.$slots, "btn"),
      _ctx.showConfirmBtn ? (openBlock(), createBlock(_component_Button, {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-btn-confirm`),
        type: "primary",
        size: "mini",
        disabled: _ctx.confirmBtnDisabled,
        onClick: _ctx.onConfirmBtnClick
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.datePickerT("datePicker.ok")), 1)
        ]),
        _: 1
      }, 8, ["class", "disabled", "onClick"])) : createCommentVNode("v-if", true)
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var PanelFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PanelFooter as default };
