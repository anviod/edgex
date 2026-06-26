"use strict";
var vue = require("vue");
var index = require("../../link/index.js");
var index$1 = require("../../button/index.js");
var useInjectDatepickerTransform = require("../hooks/use-inject-datepicker-transform.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PanelFooter",
  components: {
    Link: index,
    Button: index$1["default"]
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
    const datePickerT = useInjectDatepickerTransform();
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
  const _component_Link = vue.resolveComponent("Link");
  const _component_Button = vue.resolveComponent("Button");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
  }, [
    _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer-extra-wrapper`)
    }, [
      vue.renderSlot(_ctx.$slots, "extra")
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.showTodayBtn ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer-now-wrapper`)
    }, [
      vue.createVNode(_component_Link, { onClick: _ctx.onTodayClick }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(_ctx.datePickerT("datePicker.today")), 1)
        ]),
        _: 1
      }, 8, ["onClick"])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.$slots.btn || _ctx.showConfirmBtn ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-footer-btn-wrapper`)
    }, [
      vue.renderSlot(_ctx.$slots, "btn"),
      _ctx.showConfirmBtn ? (vue.openBlock(), vue.createBlock(_component_Button, {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-btn-confirm`),
        type: "primary",
        size: "mini",
        disabled: _ctx.confirmBtnDisabled,
        onClick: _ctx.onConfirmBtnClick
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(_ctx.datePickerT("datePicker.ok")), 1)
        ]),
        _: 1
      }, 8, ["class", "disabled", "onClick"])) : vue.createCommentVNode("v-if", true)
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var PanelFooter = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PanelFooter;
