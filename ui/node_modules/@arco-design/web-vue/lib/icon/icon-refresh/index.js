"use strict";
var iconRefresh = require("./icon-refresh.js");
const IconRefresh = Object.assign(iconRefresh, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRefresh.name, iconRefresh);
  }
});
module.exports = IconRefresh;
