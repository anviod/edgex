"use strict";
var iconCodeSquare = require("./icon-code-square.js");
const IconCodeSquare = Object.assign(iconCodeSquare, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCodeSquare.name, iconCodeSquare);
  }
});
module.exports = IconCodeSquare;
