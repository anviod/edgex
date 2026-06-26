import { defineComponent, inject, onMounted, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { cardInjectionKey } from "./context.js";
var CardMeta = defineComponent({
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
    const prefixCls = getPrefixCls("card-meta");
    const context = inject(cardInjectionKey);
    onMounted(() => {
      if (context) {
        context.hasMeta = true;
      }
    });
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const hasTitle = Boolean((_a = slots.title) != null ? _a : props.title);
      const hasDesc = Boolean((_b = slots.description) != null ? _b : props.description);
      return createVNode("div", {
        "class": prefixCls
      }, [(hasTitle || hasDesc) && createVNode("div", {
        "class": `${prefixCls}-content`
      }, [hasTitle && createVNode("div", {
        "class": `${prefixCls}-title`
      }, [(_d = (_c = slots.title) == null ? void 0 : _c.call(slots)) != null ? _d : props.title]), hasDesc && createVNode("div", {
        "class": `${prefixCls}-description`
      }, [(_f = (_e = slots.description) == null ? void 0 : _e.call(slots)) != null ? _f : props.description])]), (slots.avatar || (context == null ? void 0 : context.slots.actions)) && createVNode("div", {
        "class": [`${prefixCls}-footer `, {
          [`${prefixCls}-footer-only-actions`]: !slots.avatar
        }]
      }, [slots.avatar && createVNode("div", {
        "class": `${prefixCls}-avatar`
      }, [slots.avatar()]), context && context.slots.actions && context.renderActions(context.slots.actions())])]);
    };
  }
});
export { CardMeta as default };
