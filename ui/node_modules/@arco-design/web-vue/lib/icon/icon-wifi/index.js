"use strict";
var iconWifi = require("./icon-wifi.js");
const IconWifi = Object.assign(iconWifi, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWifi.name, iconWifi);
  }
});
module.exports = IconWifi;
