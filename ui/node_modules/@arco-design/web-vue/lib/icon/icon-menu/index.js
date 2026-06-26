"use strict";
var iconMenu = require("./icon-menu.js");
const IconMenu = Object.assign(iconMenu, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMenu.name, iconMenu);
  }
});
module.exports = IconMenu;
