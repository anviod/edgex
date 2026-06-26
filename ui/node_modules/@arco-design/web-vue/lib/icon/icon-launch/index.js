"use strict";
var iconLaunch = require("./icon-launch.js");
const IconLaunch = Object.assign(iconLaunch, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLaunch.name, iconLaunch);
  }
});
module.exports = IconLaunch;
