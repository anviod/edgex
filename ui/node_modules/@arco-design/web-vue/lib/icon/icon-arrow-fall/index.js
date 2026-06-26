"use strict";
var iconArrowFall = require("./icon-arrow-fall.js");
const IconArrowFall = Object.assign(iconArrowFall, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowFall.name, iconArrowFall);
  }
});
module.exports = IconArrowFall;
