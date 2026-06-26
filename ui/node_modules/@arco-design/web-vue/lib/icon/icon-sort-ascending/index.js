"use strict";
var iconSortAscending = require("./icon-sort-ascending.js");
const IconSortAscending = Object.assign(iconSortAscending, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSortAscending.name, iconSortAscending);
  }
});
module.exports = IconSortAscending;
