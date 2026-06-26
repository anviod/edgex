"use strict";
var iconH3 = require("./icon-h3.js");
const IconH3 = Object.assign(iconH3, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH3.name, iconH3);
  }
});
module.exports = IconH3;
