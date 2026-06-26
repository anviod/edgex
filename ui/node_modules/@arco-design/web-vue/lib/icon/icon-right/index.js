"use strict";
var iconRight = require("./icon-right.js");
const IconRight = Object.assign(iconRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRight.name, iconRight);
  }
});
module.exports = IconRight;
