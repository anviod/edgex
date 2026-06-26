"use strict";
var iconMoonFill = require("./icon-moon-fill.js");
const IconMoonFill = Object.assign(iconMoonFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMoonFill.name, iconMoonFill);
  }
});
module.exports = IconMoonFill;
