"use strict";
var iconRotateLeft = require("./icon-rotate-left.js");
const IconRotateLeft = Object.assign(iconRotateLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRotateLeft.name, iconRotateLeft);
  }
});
module.exports = IconRotateLeft;
