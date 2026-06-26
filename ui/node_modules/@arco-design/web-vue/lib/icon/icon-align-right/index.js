"use strict";
var iconAlignRight = require("./icon-align-right.js");
const IconAlignRight = Object.assign(iconAlignRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconAlignRight.name, iconAlignRight);
  }
});
module.exports = IconAlignRight;
