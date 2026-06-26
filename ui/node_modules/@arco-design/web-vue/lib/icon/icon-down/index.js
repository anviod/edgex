"use strict";
var iconDown = require("./icon-down.js");
const IconDown = Object.assign(iconDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDown.name, iconDown);
  }
});
module.exports = IconDown;
