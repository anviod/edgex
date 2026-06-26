"use strict";
var iconCheck = require("./icon-check.js");
const IconCheck = Object.assign(iconCheck, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCheck.name, iconCheck);
  }
});
module.exports = IconCheck;
