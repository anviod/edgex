"use strict";
var iconCommon = require("./icon-common.js");
const IconCommon = Object.assign(iconCommon, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCommon.name, iconCommon);
  }
});
module.exports = IconCommon;
