import { defineComponent, createVNode, TransitionGroup, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { toKebabCase } from "../_utils/convert-case.js";
import Notification from "./notification.js";
import { NOTIFICATION_POSITION } from "./interface.js";
import usePopupManager from "../_hooks/use-popup-manager.js";
import { getSlotFunction } from "../_utils/vue-utils.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var NotificationList = defineComponent({
  name: "NotificationList",
  props: {
    notifications: {
      type: Array,
      default: () => []
    },
    position: {
      type: String,
      default: "topRight",
      validator: (value) => {
        return NOTIFICATION_POSITION.includes(value);
      }
    }
  },
  emits: ["close", "afterClose"],
  setup(props, context) {
    const prefixCls = getPrefixCls("notification-list");
    const kebabPosition = toKebabCase(props.position);
    const {
      zIndex
    } = usePopupManager("message", {
      runOnMounted: true
    });
    const isRight = props.position.includes("Right");
    return () => {
      let _slot;
      return createVNode(TransitionGroup, {
        "class": [prefixCls, `${prefixCls}-${kebabPosition}`],
        "style": {
          zIndex: zIndex.value
        },
        "name": `slide-${isRight ? "right" : "left"}-notification`,
        "onAfterLeave": () => context.emit("afterClose"),
        "tag": "ul"
      }, _isSlot(_slot = props.notifications.map((item) => {
        const slots = {
          default: getSlotFunction(item.title),
          content: getSlotFunction(item.content),
          icon: getSlotFunction(item.icon),
          footer: getSlotFunction(item.footer),
          closeIcon: getSlotFunction(item.closeIcon),
          closeIconElement: getSlotFunction(item.closeIconElement)
        };
        return createVNode(Notification, {
          "key": item.id,
          "type": item.type,
          "style": item.style,
          "class": item.class,
          "duration": item.duration,
          "closable": item.closable,
          "showIcon": item.showIcon,
          "resetOnUpdate": item.resetOnUpdate,
          "onClose": () => context.emit("close", item.id)
        }, slots);
      })) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
export { NotificationList as default };
