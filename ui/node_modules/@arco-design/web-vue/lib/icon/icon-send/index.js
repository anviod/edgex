"use strict";
var iconSend = require("./icon-send.js");
const IconSend = Object.assign(iconSend, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSend.name, iconSend);
  }
});
module.exports = IconSend;
