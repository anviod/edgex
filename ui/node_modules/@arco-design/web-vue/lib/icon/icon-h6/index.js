"use strict";
var iconH6 = require("./icon-h6.js");
const IconH6 = Object.assign(iconH6, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH6.name, iconH6);
  }
});
module.exports = IconH6;
