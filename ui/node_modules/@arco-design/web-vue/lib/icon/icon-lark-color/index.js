"use strict";
var iconLarkColor = require("./icon-lark-color.js");
const IconLarkColor = Object.assign(iconLarkColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLarkColor.name, iconLarkColor);
  }
});
module.exports = IconLarkColor;
