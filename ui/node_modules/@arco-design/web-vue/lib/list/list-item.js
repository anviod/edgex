"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var ListItem = vue.defineComponent({
  name: "ListItem",
  props: {
    actionLayout: {
      type: String,
      default: "horizontal"
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("list-item");
    const renderAction = () => {
      var _a;
      const actions = (_a = slots.actions) == null ? void 0 : _a.call(slots);
      if (!actions || !actions.length) {
        return null;
      }
      return vue.createVNode("ul", {
        "class": `${prefixCls}-action`
      }, [actions.map((item, index) => vue.createVNode("li", {
        "key": `${prefixCls}-action-${index}`
      }, [item]))]);
    };
    return () => {
      var _a, _b;
      return vue.createVNode("div", {
        "role": "listitem",
        "class": prefixCls
      }, [vue.createVNode("div", {
        "class": `${prefixCls}-main`
      }, [(_a = slots.meta) == null ? void 0 : _a.call(slots), vue.createVNode("div", {
        "class": `${prefixCls}-content`
      }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]), props.actionLayout === "vertical" && renderAction()]), props.actionLayout === "horizontal" && renderAction(), slots.extra && vue.createVNode("div", {
        "class": `${prefixCls}-extra`
      }, [slots.extra()])]);
    };
  }
});
module.exports = ListItem;
