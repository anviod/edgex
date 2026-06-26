"use strict";
var iconHistory = require("./icon-history.js");
const IconHistory = Object.assign(iconHistory, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconHistory.name, iconHistory);
  }
});
module.exports = IconHistory;
