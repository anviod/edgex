import { reactive, render, ref, createVNode } from "vue";
import { MESSAGE_TYPES } from "../_utils/constant.js";
import { getOverlay } from "../_utils/dom.js";
import { isString, isUndefined, isFunction } from "../_utils/is.js";
import NotificationList from "./notification-list.js";
class NotificationManger {
  constructor(config, appContext) {
    this.notificationCount = 0;
    this.add = (config2) => {
      var _a;
      this.notificationCount++;
      const id = (_a = config2.id) != null ? _a : `__arco_notification_${this.notificationCount}`;
      if (this.notificationIds.has(id)) {
        return this.update(id, config2);
      }
      const notification2 = reactive({ id, ...config2 });
      this.notifications.value.push(notification2);
      this.notificationIds.add(id);
      return {
        close: () => this.remove(id)
      };
    };
    this.update = (id, config2) => {
      for (let i = 0; i < this.notifications.value.length; i++) {
        if (this.notifications.value[i].id === id) {
          const resetOnUpdate = !isUndefined(config2.duration);
          Object.assign(this.notifications.value[i], {
            ...config2,
            id,
            resetOnUpdate
          });
          break;
        }
      }
      return {
        close: () => this.remove(id)
      };
    };
    this.remove = (id) => {
      for (let i = 0; i < this.notifications.value.length; i++) {
        const item = this.notifications.value[i];
        if (item.id === id) {
          if (isFunction(item.onClose)) {
            item.onClose(id);
          }
          this.notifications.value.splice(i, 1);
          this.notificationIds.delete(id);
          break;
        }
      }
    };
    this.clear = () => {
      this.notifications.value.splice(0);
    };
    this.destroy = () => {
      if (this.notifications.value.length === 0 && this.container) {
        render(null, this.container);
        document.body.removeChild(this.container);
        this.container = null;
        notificationInstance[this.position] = void 0;
      }
    };
    const { position = "topRight" } = config;
    this.container = getOverlay("notification");
    this.notificationIds = /* @__PURE__ */ new Set();
    this.notifications = ref([]);
    this.position = position;
    const vm = createVNode(NotificationList, {
      notifications: this.notifications.value,
      position,
      onClose: this.remove,
      onAfterClose: this.destroy
    });
    if (appContext != null ? appContext : Notification._context) {
      vm.appContext = appContext != null ? appContext : Notification._context;
    }
    render(vm, this.container);
    document.body.appendChild(this.container);
  }
}
const notificationInstance = {};
const notification = MESSAGE_TYPES.reduce((pre, value) => {
  pre[value] = (config, appContext) => {
    if (isString(config)) {
      config = { content: config };
    }
    const _config = { type: value, ...config };
    const { position = "topRight" } = _config;
    if (!notificationInstance[position]) {
      notificationInstance[position] = new NotificationManger(
        _config,
        appContext
      );
    }
    return notificationInstance[position].add(_config);
  };
  return pre;
}, {});
notification.remove = (id) => {
  if (id) {
    Object.values(notificationInstance).forEach((item) => item == null ? void 0 : item.remove(id));
  }
};
notification.clear = (position) => {
  var _a;
  if (position) {
    (_a = notificationInstance[position]) == null ? void 0 : _a.clear();
  } else {
    Object.values(notificationInstance).forEach((item) => item == null ? void 0 : item.clear());
  }
};
const Notification = {
  ...notification,
  install: (app) => {
    const _notification = {
      clear: notification.clear
    };
    for (const key of MESSAGE_TYPES) {
      _notification[key] = (config, appContext = app._context) => notification[key](config, appContext);
    }
    app.config.globalProperties.$notification = _notification;
  },
  _context: null
};
export { Notification as default };
