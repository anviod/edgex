"use strict";
var iconH1 = require("./icon-h1.js");
const IconH1 = Object.assign(iconH1, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH1.name, iconH1);
  }
});
module.exports = IconH1;
