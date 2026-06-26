"use strict";
var iconH5 = require("./icon-h5.js");
const IconH5 = Object.assign(iconH5, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconH5.name, iconH5);
  }
});
module.exports = IconH5;
