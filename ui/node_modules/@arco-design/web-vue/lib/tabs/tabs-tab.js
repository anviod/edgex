"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-close/index.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TabsTab",
  components: {
    IconHover: iconHover,
    IconClose: index
  },
  props: {
    tab: {
      type: Object,
      required: true
    },
    active: Boolean,
    editable: Boolean
  },
  emits: ["click", "delete"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("tabs-tab");
    const tabsCtx = vue.inject(context.tabsInjectionKey, {});
    const handleClick = (e) => {
      if (!props.tab.disabled) {
        emit("click", props.tab.key, e);
      }
    };
    const onKeyDown = (ev) => {
      if (ev.key === "Enter") {
        handleClick(ev);
      }
    };
    const eventHandlers = vue.computed(() => {
      return Object.assign(
        tabsCtx.trigger === "click" ? { onClick: handleClick } : { onMouseover: handleClick },
        { onKeydown: onKeyDown }
      );
    });
    const handleDelete = (e) => {
      if (!props.tab.disabled) {
        emit("delete", props.tab.key, e);
      }
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-active`]: props.active,
        [`${prefixCls}-closable`]: props.editable && props.tab.closable,
        [`${prefixCls}-disabled`]: props.tab.disabled
      }
    ]);
    return {
      prefixCls,
      cls,
      eventHandlers,
      handleDelete
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_close = vue.resolveComponent("icon-close");
  const _component_icon_hover = vue.resolveComponent("icon-hover");
  return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
    tabindex: "0",
    class: _ctx.cls
  }, _ctx.eventHandlers), [
    vue.createElementVNode("span", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-title`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.editable && _ctx.tab.closable ? (vue.openBlock(), vue.createBlock(_component_icon_hover, {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: vue.withModifiers(_ctx.handleDelete, ["stop"])
    }, {
      default: vue.withCtx(() => [
        vue.createVNode(_component_icon_close)
      ]),
      _: 1
    }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
  ], 16);
}
var TabsTab = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TabsTab;
