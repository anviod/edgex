"use strict";
var iconH2 = require("./icon-h2.js");
const IconH2 = Object.assign(iconH2, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH2.name, iconH2);
  }
});
module.exports = IconH2;
