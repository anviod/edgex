import { defineComponent, openBlock, createElementBlock, Fragment, renderList, createBlock, Transition, withCtx, createElementVNode, normalizeClass, toDisplayString, renderSlot, createTextVNode, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "FormItemMessage",
  props: {
    error: {
      type: Array,
      default: () => []
    },
    help: String
  },
  setup() {
    const prefixCls = getPrefixCls("form-item-message");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.error.length > 0 ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(_ctx.error, (item) => {
    return openBlock(), createBlock(Transition, {
      key: item,
      name: "form-blink",
      appear: ""
    }, {
      default: withCtx(() => [
        createElementVNode("div", {
          role: "alert",
          class: normalizeClass([_ctx.prefixCls])
        }, toDisplayString(item), 3)
      ]),
      _: 2
    }, 1024);
  }), 128)) : _ctx.help || _ctx.$slots.help ? (openBlock(), createBlock(Transition, {
    key: 1,
    name: "form-blink",
    appear: ""
  }, {
    default: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass([_ctx.prefixCls, `${_ctx.prefixCls}-help`])
      }, [
        renderSlot(_ctx.$slots, "help", {}, () => [
          createTextVNode(toDisplayString(_ctx.help), 1)
        ])
      ], 2)
    ]),
    _: 3
  })) : createCommentVNode("v-if", true);
}
var FormItemMessage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { FormItemMessage as default };
