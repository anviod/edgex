"use strict";
var iconSync = require("./icon-sync.js");
const IconSync = Object.assign(iconSync, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSync.name, iconSync);
  }
});
module.exports = IconSync;
