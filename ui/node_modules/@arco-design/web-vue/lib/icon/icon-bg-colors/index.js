"use strict";
var iconBgColors = require("./icon-bg-colors.js");
const IconBgColors = Object.assign(iconBgColors, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBgColors.name, iconBgColors);
  }
});
module.exports = IconBgColors;
