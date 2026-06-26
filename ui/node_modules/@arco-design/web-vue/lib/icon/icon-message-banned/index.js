"use strict";
var iconMessageBanned = require("./icon-message-banned.js");
const IconMessageBanned = Object.assign(iconMessageBanned, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMessageBanned.name, iconMessageBanned);
  }
});
module.exports = IconMessageBanned;
