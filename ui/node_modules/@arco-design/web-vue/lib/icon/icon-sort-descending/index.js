"use strict";
var iconSortDescending = require("./icon-sort-descending.js");
const IconSortDescending = Object.assign(iconSortDescending, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSortDescending.name, iconSortDescending);
  }
});
module.exports = IconSortDescending;
