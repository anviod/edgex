"use strict";
var iconSort = require("./icon-sort.js");
const IconSort = Object.assign(iconSort, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSort.name, iconSort);
  }
});
module.exports = IconSort;
