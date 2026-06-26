"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "AnchorLink",
  props: {
    title: String,
    href: String
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("anchor");
    const linkCls = `${prefixCls}-link`;
    const linkRef = vue.ref();
    const context$1 = vue.inject(context.anchorInjectionKey, void 0);
    vue.onMounted(() => {
      if (props.href && linkRef.value) {
        context$1 == null ? void 0 : context$1.addLink(props.href, linkRef.value);
      }
    });
    const cls = vue.computed(() => [
      `${linkCls}-item`,
      {
        [`${linkCls}-active`]: (context$1 == null ? void 0 : context$1.currentLink) === props.href
      }
    ]);
    const handleClick = (e) => context$1 == null ? void 0 : context$1.handleClick(e, props.href);
    return {
      prefixCls,
      linkCls,
      cls,
      linkRef,
      handleClick
    };
  }
});
const _hoisted_1 = ["href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("li", {
    ref: "linkRef",
    class: vue.normalizeClass(_ctx.cls)
  }, [
    vue.createElementVNode("a", {
      class: vue.normalizeClass(_ctx.linkCls),
      href: _ctx.href,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
      ])
    ], 10, _hoisted_1),
    _ctx.$slots.sublist ? (vue.openBlock(), vue.createElementBlock("ul", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-sublist`)
    }, [
      vue.renderSlot(_ctx.$slots, "sublist")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var AnchorLink = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = AnchorLink;
