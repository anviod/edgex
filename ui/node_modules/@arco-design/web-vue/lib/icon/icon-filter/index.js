"use strict";
var iconFilter = require("./icon-filter.js");
const IconFilter = Object.assign(iconFilter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFilter.name, iconFilter);
  }
});
module.exports = IconFilter;
