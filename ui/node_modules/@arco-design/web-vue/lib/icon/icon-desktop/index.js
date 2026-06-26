"use strict";
var iconDesktop = require("./icon-desktop.js");
const IconDesktop = Object.assign(iconDesktop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDesktop.name, iconDesktop);
  }
});
module.exports = IconDesktop;
