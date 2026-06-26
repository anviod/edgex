"use strict";
var iconFontColors = require("./icon-font-colors.js");
const IconFontColors = Object.assign(iconFontColors, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFontColors.name, iconFontColors);
  }
});
module.exports = IconFontColors;
