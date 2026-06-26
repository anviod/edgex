"use strict";
var iconHome = require("./icon-home.js");
const IconHome = Object.assign(iconHome, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconHome.name, iconHome);
  }
});
module.exports = IconHome;
