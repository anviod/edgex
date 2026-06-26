"use strict";
var vue = require("vue");
var constant = require("../_utils/constant.js");
var dom = require("../_utils/dom.js");
var is = require("../_utils/is.js");
var notificationList = require("./notification-list.js");
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
      const notification2 = vue.reactive({ id, ...config2 });
      this.notifications.value.push(notification2);
      this.notificationIds.add(id);
      return {
        close: () => this.remove(id)
      };
    };
    this.update = (id, config2) => {
      for (let i = 0; i < this.notifications.value.length; i++) {
        if (this.notifications.value[i].id === id) {
          const resetOnUpdate = !is.isUndefined(config2.duration);
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
          if (is.isFunction(item.onClose)) {
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
        vue.render(null, this.container);
        document.body.removeChild(this.container);
        this.container = null;
        notificationInstance[this.position] = void 0;
      }
    };
    const { position = "topRight" } = config;
    this.container = dom.getOverlay("notification");
    this.notificationIds = /* @__PURE__ */ new Set();
    this.notifications = vue.ref([]);
    this.position = position;
    const vm = vue.createVNode(notificationList, {
      notifications: this.notifications.value,
      position,
      onClose: this.remove,
      onAfterClose: this.destroy
    });
    if (appContext != null ? appContext : Notification._context) {
      vm.appContext = appContext != null ? appContext : Notification._context;
    }
    vue.render(vm, this.container);
    document.body.appendChild(this.container);
  }
}
const notificationInstance = {};
const notification = constant.MESSAGE_TYPES.reduce((pre, value) => {
  pre[value] = (config, appContext) => {
    if (is.isString(config)) {
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
    for (const key of constant.MESSAGE_TYPES) {
      _notification[key] = (config, appContext = app._context) => notification[key](config, appContext);
    }
    app.config.globalProperties.$notification = _notification;
  },
  _context: null
};
module.exports = Notification;
