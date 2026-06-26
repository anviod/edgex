"use strict";
var iconNotificationClose = require("./icon-notification-close.js");
const IconNotificationClose = Object.assign(iconNotificationClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconNotificationClose.name, iconNotificationClose);
  }
});
module.exports = IconNotificationClose;
