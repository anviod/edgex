"use strict";
var iconBold = require("./icon-bold.js");
const IconBold = Object.assign(iconBold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBold.name, iconBold);
  }
});
module.exports = IconBold;
