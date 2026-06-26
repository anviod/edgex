"use strict";
var iconBrush = require("./icon-brush.js");
const IconBrush = Object.assign(iconBrush, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBrush.name, iconBrush);
  }
});
module.exports = IconBrush;
