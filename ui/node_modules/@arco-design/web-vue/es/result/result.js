import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, createElementVNode, renderSlot, createBlock, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconInfo from "../icon/icon-info/index.js";
import IconCheck from "../icon/icon-check/index.js";
import IconExclamation from "../icon/icon-exclamation/index.js";
import IconClose from "../icon/icon-close/index.js";
import ResultForbidden from "./403.js";
import ResultNotFound from "./404.js";
import ResultServerError from "./500.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const RESULT_STATUS = [
  "info",
  "success",
  "warning",
  "error",
  "403",
  "404",
  "500",
  null
];
const _sfc_main = defineComponent({
  name: "Result",
  components: {
    IconInfo,
    IconCheck,
    IconExclamation,
    IconClose,
    ResultForbidden,
    ResultNotFound,
    ResultServerError
  },
  props: {
    status: {
      type: String,
      default: "info",
      validator: (value) => {
        return RESULT_STATUS.includes(value);
      }
    },
    title: String,
    subtitle: String
  },
  setup() {
    const prefixCls = getPrefixCls("result");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info = resolveComponent("icon-info");
  const _component_icon_check = resolveComponent("icon-check");
  const _component_icon_exclamation = resolveComponent("icon-exclamation");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_result_forbidden = resolveComponent("result-forbidden");
  const _component_result_not_found = resolveComponent("result-not-found");
  const _component_result_server_error = resolveComponent("result-server-error");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    createElementVNode("div", {
      class: normalizeClass([
        `${_ctx.prefixCls}-icon`,
        {
          [`${_ctx.prefixCls}-icon-${_ctx.status}`]: _ctx.status,
          [`${_ctx.prefixCls}-icon-custom`]: _ctx.status === null
        }
      ])
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-icon-tip`)
      }, [
        renderSlot(_ctx.$slots, "icon", {}, () => [
          _ctx.status === "info" ? (openBlock(), createBlock(_component_icon_info, { key: 0 })) : _ctx.status === "success" ? (openBlock(), createBlock(_component_icon_check, { key: 1 })) : _ctx.status === "warning" ? (openBlock(), createBlock(_component_icon_exclamation, { key: 2 })) : _ctx.status === "error" ? (openBlock(), createBlock(_component_icon_close, { key: 3 })) : _ctx.status === "403" ? (openBlock(), createBlock(_component_result_forbidden, { key: 4 })) : _ctx.status === "404" ? (openBlock(), createBlock(_component_result_not_found, { key: 5 })) : _ctx.status === "500" ? (openBlock(), createBlock(_component_result_server_error, { key: 6 })) : createCommentVNode("v-if", true)
        ])
      ], 2)
    ], 2),
    _ctx.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      renderSlot(_ctx.$slots, "title", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.subtitle || _ctx.$slots.subtitle ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-subtitle`)
    }, [
      renderSlot(_ctx.$slots, "subtitle", {}, () => [
        createTextVNode(toDisplayString(_ctx.subtitle), 1)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-extra`)
    }, [
      renderSlot(_ctx.$slots, "extra")
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
      key: 3,
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var _Result = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Result as default };
