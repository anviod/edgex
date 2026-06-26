import { defineComponent, createVNode, TransitionGroup, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Message from "./message.js";
import usePopupManager from "../_hooks/use-popup-manager.js";
import { getSlotFunction } from "../_utils/vue-utils.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var MessageList = defineComponent({
  name: "MessageList",
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    position: {
      type: String,
      default: "top"
    }
  },
  emits: ["close", "afterClose"],
  setup(props, context) {
    const prefixCls = getPrefixCls("message-list");
    const {
      zIndex
    } = usePopupManager("message", {
      runOnMounted: true
    });
    return () => {
      let _slot;
      return createVNode(TransitionGroup, {
        "class": [prefixCls, `${prefixCls}-${props.position}`],
        "name": "fade-message",
        "tag": "ul",
        "style": {
          zIndex: zIndex.value
        },
        "onAfterLeave": () => context.emit("afterClose")
      }, _isSlot(_slot = props.messages.map((item) => {
        const slots = {
          default: getSlotFunction(item.content),
          icon: getSlotFunction(item.icon)
        };
        return createVNode(Message, {
          "key": item.id,
          "type": item.type,
          "duration": item.duration,
          "closable": item.closable,
          "resetOnUpdate": item.resetOnUpdate,
          "resetOnHover": item.resetOnHover,
          "onClose": () => context.emit("close", item.id)
        }, slots);
      })) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
export { MessageList as default };
