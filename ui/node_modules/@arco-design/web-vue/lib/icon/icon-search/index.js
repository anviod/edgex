"use strict";
var iconSearch = require("./icon-search.js");
const IconSearch = Object.assign(iconSearch, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSearch.name, iconSearch);
  }
});
module.exports = IconSearch;
