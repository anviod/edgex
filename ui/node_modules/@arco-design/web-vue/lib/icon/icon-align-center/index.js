"use strict";
var iconAlignCenter = require("./icon-align-center.js");
const IconAlignCenter = Object.assign(iconAlignCenter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconAlignCenter.name, iconAlignCenter);
  }
});
module.exports = IconAlignCenter;
