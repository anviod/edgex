"use strict";
var iconSun = require("./icon-sun.js");
const IconSun = Object.assign(iconSun, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSun.name, iconSun);
  }
});
module.exports = IconSun;
