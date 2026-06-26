import { defineComponent, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
var ListItem = defineComponent({
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
    const prefixCls = getPrefixCls("list-item");
    const renderAction = () => {
      var _a;
      const actions = (_a = slots.actions) == null ? void 0 : _a.call(slots);
      if (!actions || !actions.length) {
        return null;
      }
      return createVNode("ul", {
        "class": `${prefixCls}-action`
      }, [actions.map((item, index) => createVNode("li", {
        "key": `${prefixCls}-action-${index}`
      }, [item]))]);
    };
    return () => {
      var _a, _b;
      return createVNode("div", {
        "role": "listitem",
        "class": prefixCls
      }, [createVNode("div", {
        "class": `${prefixCls}-main`
      }, [(_a = slots.meta) == null ? void 0 : _a.call(slots), createVNode("div", {
        "class": `${prefixCls}-content`
      }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]), props.actionLayout === "vertical" && renderAction()]), props.actionLayout === "horizontal" && renderAction(), slots.extra && createVNode("div", {
        "class": `${prefixCls}-extra`
      }, [slots.extra()])]);
    };
  }
});
export { ListItem as default };
