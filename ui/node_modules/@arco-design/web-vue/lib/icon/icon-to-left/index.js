"use strict";
var iconToLeft = require("./icon-to-left.js");
const IconToLeft = Object.assign(iconToLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconToLeft.name, iconToLeft);
  }
});
module.exports = IconToLeft;
