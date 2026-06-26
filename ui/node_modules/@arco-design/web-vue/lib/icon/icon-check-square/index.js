"use strict";
var iconCheckSquare = require("./icon-check-square.js");
const IconCheckSquare = Object.assign(iconCheckSquare, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCheckSquare.name, iconCheckSquare);
  }
});
module.exports = IconCheckSquare;
