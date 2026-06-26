import _IconNotificationClose from "./icon-notification-close.js";
const IconNotificationClose = Object.assign(_IconNotificationClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconNotificationClose.name, _IconNotificationClose);
  }
});
export { IconNotificationClose as default };
