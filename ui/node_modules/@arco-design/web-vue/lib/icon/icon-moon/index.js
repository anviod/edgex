"use strict";
var iconMoon = require("./icon-moon.js");
const IconMoon = Object.assign(iconMoon, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMoon.name, iconMoon);
  }
});
module.exports = IconMoon;
