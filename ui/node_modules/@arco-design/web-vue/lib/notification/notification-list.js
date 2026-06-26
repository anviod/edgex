"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var convertCase = require("../_utils/convert-case.js");
var notification = require("./notification.js");
var _interface = require("./interface.js");
var usePopupManager = require("../_hooks/use-popup-manager.js");
var vueUtils = require("../_utils/vue-utils.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var NotificationList = vue.defineComponent({
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
        return _interface.NOTIFICATION_POSITION.includes(value);
      }
    }
  },
  emits: ["close", "afterClose"],
  setup(props, context) {
    const prefixCls = globalConfig.getPrefixCls("notification-list");
    const kebabPosition = convertCase.toKebabCase(props.position);
    const {
      zIndex
    } = usePopupManager("message", {
      runOnMounted: true
    });
    const isRight = props.position.includes("Right");
    return () => {
      let _slot;
      return vue.createVNode(vue.TransitionGroup, {
        "class": [prefixCls, `${prefixCls}-${kebabPosition}`],
        "style": {
          zIndex: zIndex.value
        },
        "name": `slide-${isRight ? "right" : "left"}-notification`,
        "onAfterLeave": () => context.emit("afterClose"),
        "tag": "ul"
      }, _isSlot(_slot = props.notifications.map((item) => {
        const slots = {
          default: vueUtils.getSlotFunction(item.title),
          content: vueUtils.getSlotFunction(item.content),
          icon: vueUtils.getSlotFunction(item.icon),
          footer: vueUtils.getSlotFunction(item.footer),
          closeIcon: vueUtils.getSlotFunction(item.closeIcon),
          closeIconElement: vueUtils.getSlotFunction(item.closeIconElement)
        };
        return vue.createVNode(notification, {
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
module.exports = NotificationList;
