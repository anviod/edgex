"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-left/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PageHeader",
  components: { AIconHover: iconHover, IconLeft: index },
  props: {
    title: String,
    subtitle: String,
    showBack: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    "back"
  ],
  setup(props, { emit, slots }) {
    const prefixCls = globalConfig.getPrefixCls("page-header");
    const handleBack = (e) => {
      emit("back", e);
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-with-breadcrumb`]: Boolean(slots.breadcrumb),
        [`${prefixCls}-with-content`]: Boolean(slots.default)
      }
    ]);
    return {
      prefixCls,
      cls,
      handleBack
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_left = vue.resolveComponent("icon-left");
  const _component_a_icon_hover = vue.resolveComponent("a-icon-hover");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-wrapper`)
    }, [
      _ctx.$slots.breadcrumb ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-breadcrumb`)
      }, [
        vue.renderSlot(_ctx.$slots, "breadcrumb")
      ], 2)) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-header`)
      }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-main`)
        }, [
          _ctx.showBack ? (vue.openBlock(), vue.createBlock(_component_a_icon_hover, {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-back-btn`),
            prefix: _ctx.prefixCls,
            onClick: _ctx.handleBack
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "back-icon", {}, () => [
                vue.createVNode(_component_icon_left)
              ])
            ]),
            _: 3
          }, 8, ["class", "prefix", "onClick"])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ], 2),
          _ctx.$slots.subtitle || _ctx.subtitle ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(`${_ctx.prefixCls}-divider`)
          }, null, 2)) : vue.createCommentVNode("v-if", true),
          _ctx.$slots.subtitle || _ctx.subtitle ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(`${_ctx.prefixCls}-subtitle`)
          }, [
            vue.renderSlot(_ctx.$slots, "subtitle", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.subtitle), 1)
            ])
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 2),
        _ctx.$slots.extra ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-extra`)
        }, [
          vue.renderSlot(_ctx.$slots, "extra")
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 2)
    ], 2),
    _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var _PageHeader = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _PageHeader;
