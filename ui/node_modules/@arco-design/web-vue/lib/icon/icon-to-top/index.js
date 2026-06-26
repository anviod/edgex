"use strict";
var iconToTop = require("./icon-to-top.js");
const IconToTop = Object.assign(iconToTop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconToTop.name, iconToTop);
  }
});
module.exports = IconToTop;
