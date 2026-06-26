"use strict";
var iconPen = require("./icon-pen.js");
const IconPen = Object.assign(iconPen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPen.name, iconPen);
  }
});
module.exports = IconPen;
