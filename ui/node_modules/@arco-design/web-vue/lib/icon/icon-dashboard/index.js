"use strict";
var iconDashboard = require("./icon-dashboard.js");
const IconDashboard = Object.assign(iconDashboard, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDashboard.name, iconDashboard);
  }
});
module.exports = IconDashboard;
