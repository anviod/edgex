"use strict";
var iconStarFill = require("./icon-star-fill.js");
const IconStarFill = Object.assign(iconStarFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconStarFill.name, iconStarFill);
  }
});
module.exports = IconStarFill;
