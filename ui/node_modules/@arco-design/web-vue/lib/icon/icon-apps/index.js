"use strict";
var iconApps = require("./icon-apps.js");
const IconApps = Object.assign(iconApps, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconApps.name, iconApps);
  }
});
module.exports = IconApps;
