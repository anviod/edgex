"use strict";
var iconH7 = require("./icon-h7.js");
const IconH7 = Object.assign(iconH7, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH7.name, iconH7);
  }
});
module.exports = IconH7;
