"use strict";
var iconPalette = require("./icon-palette.js");
const IconPalette = Object.assign(iconPalette, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPalette.name, iconPalette);
  }
});
module.exports = IconPalette;
