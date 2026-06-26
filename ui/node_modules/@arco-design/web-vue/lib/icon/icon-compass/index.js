"use strict";
var iconCompass = require("./icon-compass.js");
const IconCompass = Object.assign(iconCompass, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCompass.name, iconCompass);
  }
});
module.exports = IconCompass;
