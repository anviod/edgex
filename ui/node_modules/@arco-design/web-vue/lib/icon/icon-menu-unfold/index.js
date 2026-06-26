"use strict";
var iconMenuUnfold = require("./icon-menu-unfold.js");
const IconMenuUnfold = Object.assign(iconMenuUnfold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMenuUnfold.name, iconMenuUnfold);
  }
});
module.exports = IconMenuUnfold;
