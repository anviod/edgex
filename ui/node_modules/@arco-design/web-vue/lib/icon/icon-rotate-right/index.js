"use strict";
var iconRotateRight = require("./icon-rotate-right.js");
const IconRotateRight = Object.assign(iconRotateRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRotateRight.name, iconRotateRight);
  }
});
module.exports = IconRotateRight;
