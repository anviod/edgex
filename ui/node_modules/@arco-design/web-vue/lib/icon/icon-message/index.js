"use strict";
var iconMessage = require("./icon-message.js");
const IconMessage = Object.assign(iconMessage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMessage.name, iconMessage);
  }
});
module.exports = IconMessage;
