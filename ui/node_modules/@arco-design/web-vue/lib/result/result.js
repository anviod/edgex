"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-info/index.js");
var index$1 = require("../icon/icon-check/index.js");
var index$2 = require("../icon/icon-exclamation/index.js");
var index$3 = require("../icon/icon-close/index.js");
var _403 = require("./403.js");
var _404 = require("./404.js");
var _500 = require("./500.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
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
const _sfc_main = vue.defineComponent({
  name: "Result",
  components: {
    IconInfo: index,
    IconCheck: index$1,
    IconExclamation: index$2,
    IconClose: index$3,
    ResultForbidden: _403,
    ResultNotFound: _404,
    ResultServerError: _500
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
    const prefixCls = globalConfig.getPrefixCls("result");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info = vue.resolveComponent("icon-info");
  const _component_icon_check = vue.resolveComponent("icon-check");
  const _component_icon_exclamation = vue.resolveComponent("icon-exclamation");
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_result_forbidden = vue.resolveComponent("result-forbidden");
  const _component_result_not_found = vue.resolveComponent("result-not-found");
  const _component_result_server_error = vue.resolveComponent("result-server-error");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass([
        `${_ctx.prefixCls}-icon`,
        {
          [`${_ctx.prefixCls}-icon-${_ctx.status}`]: _ctx.status,
          [`${_ctx.prefixCls}-icon-custom`]: _ctx.status === null
        }
      ])
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-icon-tip`)
      }, [
        vue.renderSlot(_ctx.$slots, "icon", {}, () => [
          _ctx.status === "info" ? (vue.openBlock(), vue.createBlock(_component_icon_info, { key: 0 })) : _ctx.status === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check, { key: 1 })) : _ctx.status === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation, { key: 2 })) : _ctx.status === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close, { key: 3 })) : _ctx.status === "403" ? (vue.openBlock(), vue.createBlock(_component_result_forbidden, { key: 4 })) : _ctx.status === "404" ? (vue.openBlock(), vue.createBlock(_component_result_not_found, { key: 5 })) : _ctx.status === "500" ? (vue.openBlock(), vue.createBlock(_component_result_server_error, { key: 6 })) : vue.createCommentVNode("v-if", true)
        ])
      ], 2)
    ], 2),
    _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      vue.renderSlot(_ctx.$slots, "title", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.subtitle || _ctx.$slots.subtitle ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-subtitle`)
    }, [
      vue.renderSlot(_ctx.$slots, "subtitle", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.subtitle), 1)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 2,
      class: vue.normalizeClass(`${_ctx.prefixCls}-extra`)
    }, [
      vue.renderSlot(_ctx.$slots, "extra")
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 3,
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var _Result = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Result;
