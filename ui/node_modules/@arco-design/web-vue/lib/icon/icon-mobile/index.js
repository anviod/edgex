"use strict";
var iconMobile = require("./icon-mobile.js");
const IconMobile = Object.assign(iconMobile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMobile.name, iconMobile);
  }
});
module.exports = IconMobile;
