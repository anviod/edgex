"use strict";
var iconArrowDown = require("./icon-arrow-down.js");
const IconArrowDown = Object.assign(iconArrowDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowDown.name, iconArrowDown);
  }
});
module.exports = IconArrowDown;
