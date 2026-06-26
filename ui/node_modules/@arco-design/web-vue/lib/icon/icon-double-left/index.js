"use strict";
var iconDoubleLeft = require("./icon-double-left.js");
const IconDoubleLeft = Object.assign(iconDoubleLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDoubleLeft.name, iconDoubleLeft);
  }
});
module.exports = IconDoubleLeft;
