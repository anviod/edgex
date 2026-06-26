"use strict";
var iconSelectAll = require("./icon-select-all.js");
const IconSelectAll = Object.assign(iconSelectAll, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSelectAll.name, iconSelectAll);
  }
});
module.exports = IconSelectAll;
