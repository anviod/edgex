"use strict";
var iconToRight = require("./icon-to-right.js");
const IconToRight = Object.assign(iconToRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconToRight.name, iconToRight);
  }
});
module.exports = IconToRight;
