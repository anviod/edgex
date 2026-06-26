"use strict";
var iconSafe = require("./icon-safe.js");
const IconSafe = Object.assign(iconSafe, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSafe.name, iconSafe);
  }
});
module.exports = IconSafe;
