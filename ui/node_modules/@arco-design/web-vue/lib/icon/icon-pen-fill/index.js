"use strict";
var iconPenFill = require("./icon-pen-fill.js");
const IconPenFill = Object.assign(iconPenFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPenFill.name, iconPenFill);
  }
});
module.exports = IconPenFill;
