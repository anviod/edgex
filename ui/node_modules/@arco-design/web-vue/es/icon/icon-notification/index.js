import _IconNotification from "./icon-notification.js";
const IconNotification = Object.assign(_IconNotification, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconNotification.name, _IconNotification);
  }
});
export { IconNotification as default };
