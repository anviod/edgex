"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var message = require("./message.js");
var usePopupManager = require("../_hooks/use-popup-manager.js");
var vueUtils = require("../_utils/vue-utils.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var MessageList = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("message-list");
    const {
      zIndex
    } = usePopupManager("message", {
      runOnMounted: true
    });
    return () => {
      let _slot;
      return vue.createVNode(vue.TransitionGroup, {
        "class": [prefixCls, `${prefixCls}-${props.position}`],
        "name": "fade-message",
        "tag": "ul",
        "style": {
          zIndex: zIndex.value
        },
        "onAfterLeave": () => context.emit("afterClose")
      }, _isSlot(_slot = props.messages.map((item) => {
        const slots = {
          default: vueUtils.getSlotFunction(item.content),
          icon: vueUtils.getSlotFunction(item.icon)
        };
        return vue.createVNode(message, {
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
module.exports = MessageList;
