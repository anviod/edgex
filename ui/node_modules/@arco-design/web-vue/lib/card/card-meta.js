"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var CardMeta = vue.defineComponent({
  name: "CardMeta",
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("card-meta");
    const context$1 = vue.inject(context.cardInjectionKey);
    vue.onMounted(() => {
      if (context$1) {
        context$1.hasMeta = true;
      }
    });
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const hasTitle = Boolean((_a = slots.title) != null ? _a : props.title);
      const hasDesc = Boolean((_b = slots.description) != null ? _b : props.description);
      return vue.createVNode("div", {
        "class": prefixCls
      }, [(hasTitle || hasDesc) && vue.createVNode("div", {
        "class": `${prefixCls}-content`
      }, [hasTitle && vue.createVNode("div", {
        "class": `${prefixCls}-title`
      }, [(_d = (_c = slots.title) == null ? void 0 : _c.call(slots)) != null ? _d : props.title]), hasDesc && vue.createVNode("div", {
        "class": `${prefixCls}-description`
      }, [(_f = (_e = slots.description) == null ? void 0 : _e.call(slots)) != null ? _f : props.description])]), (slots.avatar || (context$1 == null ? void 0 : context$1.slots.actions)) && vue.createVNode("div", {
        "class": [`${prefixCls}-footer `, {
          [`${prefixCls}-footer-only-actions`]: !slots.avatar
        }]
      }, [slots.avatar && vue.createVNode("div", {
        "class": `${prefixCls}-avatar`
      }, [slots.avatar()]), context$1 && context$1.slots.actions && context$1.renderActions(context$1.slots.actions())])]);
    };
  }
});
module.exports = CardMeta;
