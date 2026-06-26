"use strict";
var iconLeft = require("./icon-left.js");
const IconLeft = Object.assign(iconLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLeft.name, iconLeft);
  }
});
module.exports = IconLeft;
