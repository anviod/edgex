"use strict";
var iconH4 = require("./icon-h4.js");
const IconH4 = Object.assign(iconH4, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH4.name, iconH4);
  }
});
module.exports = IconH4;
