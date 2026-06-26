"use strict";
var iconSunFill = require("./icon-sun-fill.js");
const IconSunFill = Object.assign(iconSunFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSunFill.name, iconSunFill);
  }
});
module.exports = IconSunFill;
