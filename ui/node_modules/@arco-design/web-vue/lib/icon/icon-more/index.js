"use strict";
var iconMore = require("./icon-more.js");
const IconMore = Object.assign(iconMore, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMore.name, iconMore);
  }
});
module.exports = IconMore;
