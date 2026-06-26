"use strict";
var iconScan = require("./icon-scan.js");
const IconScan = Object.assign(iconScan, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconScan.name, iconScan);
  }
});
module.exports = IconScan;
