"use strict";
var iconMenuFold = require("./icon-menu-fold.js");
const IconMenuFold = Object.assign(iconMenuFold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMenuFold.name, iconMenuFold);
  }
});
module.exports = IconMenuFold;
