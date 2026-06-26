"use strict";
var vue = require("vue");
var index = require("../../button/index.js");
var renderFunction = require("../../_components/render-function.js");
var is = require("../../_utils/is.js");
var useInjectDatepickerTransform = require("../hooks/use-inject-datepicker-transform.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PanelShortcuts",
  components: {
    Button: index["default"],
    RenderFunction: renderFunction
  },
  props: {
    prefixCls: {
      type: String,
      required: true
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    showNowBtn: {
      type: Boolean
    }
  },
  emits: ["item-click", "item-mouse-enter", "item-mouse-leave", "now-click"],
  setup(props, { emit }) {
    const datePickerT = useInjectDatepickerTransform();
    return {
      datePickerT,
      onItemClick: (item) => {
        emit("item-click", item);
      },
      onItemMouseEnter: (item) => {
        emit("item-mouse-enter", item);
      },
      onItemMouseLeave: (item) => {
        emit("item-mouse-leave", item);
      },
      onNowClick: () => {
        emit("now-click");
      },
      isFunction: is.isFunction
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = vue.resolveComponent("Button");
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(`${_ctx.prefixCls}-shortcuts`)
  }, [
    _ctx.showNowBtn ? (vue.openBlock(), vue.createBlock(_component_Button, {
      key: 0,
      size: "mini",
      onClick: _cache[0] || (_cache[0] = () => _ctx.onNowClick())
    }, {
      default: vue.withCtx(() => [
        vue.createTextVNode(vue.toDisplayString(_ctx.datePickerT("datePicker.now")), 1)
      ]),
      _: 1
    })) : vue.createCommentVNode("v-if", true),
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.shortcuts, (item, index2) => {
      return vue.openBlock(), vue.createBlock(_component_Button, {
        key: index2,
        size: "mini",
        onClick: () => _ctx.onItemClick(item),
        onMouseenter: () => _ctx.onItemMouseEnter(item),
        onMouseleave: () => _ctx.onItemMouseLeave(item)
      }, {
        default: vue.withCtx(() => [
          _ctx.isFunction(item.label) ? (vue.openBlock(), vue.createBlock(_component_RenderFunction, {
            key: 0,
            "render-func": item.label
          }, null, 8, ["render-func"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createTextVNode(vue.toDisplayString(item.label), 1)
          ], 64))
        ]),
        _: 2
      }, 1032, ["onClick", "onMouseenter", "onMouseleave"]);
    }), 128))
  ], 2);
}
var PanelShortcuts = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PanelShortcuts;
