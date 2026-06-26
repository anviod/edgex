"use strict";
var iconFire = require("./icon-fire.js");
const IconFire = Object.assign(iconFire, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFire.name, iconFire);
  }
});
module.exports = IconFire;
