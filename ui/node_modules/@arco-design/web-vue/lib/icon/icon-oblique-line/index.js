"use strict";
var iconObliqueLine = require("./icon-oblique-line.js");
const IconObliqueLine = Object.assign(iconObliqueLine, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconObliqueLine.name, iconObliqueLine);
  }
});
module.exports = IconObliqueLine;
