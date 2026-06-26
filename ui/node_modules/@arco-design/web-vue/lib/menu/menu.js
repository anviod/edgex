"use strict";
var vue = require("vue");
var context = require("../layout/context.js");
var context$1 = require("./context.js");
var baseMenu = require("./base-menu.js");
var overflowWrap = require("./overflow-wrap.js");
var _Menu = vue.defineComponent({
  name: "Menu",
  components: {
    BaseMenu: baseMenu
  },
  inheritAttrs: false,
  props: {
    theme: {
      type: String
    },
    mode: {
      type: String,
      default: "vertical"
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    const {
      theme: propTheme,
      mode
    } = vue.toRefs(props);
    const siderContext = vue.inject(context.SiderInjectionKey, void 0);
    const siderCollapsed = vue.computed(() => (siderContext == null ? void 0 : siderContext.collapsed) || false);
    const theme = vue.computed(() => (propTheme == null ? void 0 : propTheme.value) || (siderContext == null ? void 0 : siderContext.theme) || "light");
    vue.provide(context$1.MenuInjectionKey, void 0);
    vue.provide(context$1.LevelInjectionKey, void 0);
    return () => vue.createVNode(baseMenu, vue.mergeProps(props, attrs, {
      "theme": theme.value,
      "inTrigger": false,
      "siderCollapsed": siderCollapsed.value,
      "isRoot": true
    }), {
      ...slots,
      default: mode.value === "horizontal" && slots.default ? () => vue.createVNode(overflowWrap, null, {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots)];
        }
      }) : slots.default
    });
  }
});
module.exports = _Menu;
