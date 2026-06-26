"use strict";
var iconSettings = require("./icon-settings.js");
const IconSettings = Object.assign(iconSettings, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSettings.name, iconSettings);
  }
});
module.exports = IconSettings;
