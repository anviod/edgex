"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TabPane",
  props: {
    title: String,
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnHide: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    var _a;
    const { title, disabled, closable } = vue.toRefs(props);
    const instance = vue.getCurrentInstance();
    const prefixCls = globalConfig.getPrefixCls("tabs");
    const tabsCtx = vue.inject(context.tabsInjectionKey, {});
    const itemRef = vue.ref();
    const key = vue.computed(() => instance == null ? void 0 : instance.vnode.key);
    const active = vue.computed(() => key.value === tabsCtx.activeKey);
    const mounted = vue.ref(tabsCtx.lazyLoad ? active.value : true);
    const data = vue.reactive({
      key,
      title,
      disabled,
      closable,
      slots
    });
    if (instance == null ? void 0 : instance.uid) {
      (_a = tabsCtx.addItem) == null ? void 0 : _a.call(tabsCtx, instance.uid, data);
    }
    vue.onBeforeUnmount(() => {
      var _a2;
      if (instance == null ? void 0 : instance.uid) {
        (_a2 = tabsCtx.removeItem) == null ? void 0 : _a2.call(tabsCtx, instance.uid);
      }
    });
    vue.watch(active, (active2) => {
      if (active2) {
        if (!mounted.value) {
          mounted.value = true;
        }
      } else if (props.destroyOnHide || tabsCtx.destroyOnHide) {
        mounted.value = false;
      }
    });
    vue.onUpdated(() => {
      data.slots = { ...slots };
    });
    return {
      prefixCls,
      active,
      itemRef,
      mounted
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "itemRef",
    class: vue.normalizeClass([
      `${_ctx.prefixCls}-content-item`,
      { [`${_ctx.prefixCls}-content-item-active`]: _ctx.active }
    ])
  }, [
    _ctx.mounted ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-pane`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var TabPane = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = TabPane;
