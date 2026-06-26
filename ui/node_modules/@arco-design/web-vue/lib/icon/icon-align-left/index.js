"use strict";
var iconAlignLeft = require("./icon-align-left.js");
const IconAlignLeft = Object.assign(iconAlignLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconAlignLeft.name, iconAlignLeft);
  }
});
module.exports = IconAlignLeft;
