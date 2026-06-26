"use strict";
var iconDoubleDown = require("./icon-double-down.js");
const IconDoubleDown = Object.assign(iconDoubleDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDoubleDown.name, iconDoubleDown);
  }
});
module.exports = IconDoubleDown;
