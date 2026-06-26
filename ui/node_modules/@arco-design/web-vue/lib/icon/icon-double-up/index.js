"use strict";
var iconDoubleUp = require("./icon-double-up.js");
const IconDoubleUp = Object.assign(iconDoubleUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDoubleUp.name, iconDoubleUp);
  }
});
module.exports = IconDoubleUp;
