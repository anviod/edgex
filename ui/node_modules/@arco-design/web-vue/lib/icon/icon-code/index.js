"use strict";
var iconCode = require("./icon-code.js");
const IconCode = Object.assign(iconCode, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCode.name, iconCode);
  }
});
module.exports = IconCode;
