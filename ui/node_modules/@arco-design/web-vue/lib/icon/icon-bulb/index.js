"use strict";
var iconBulb = require("./icon-bulb.js");
const IconBulb = Object.assign(iconBulb, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBulb.name, iconBulb);
  }
});
module.exports = IconBulb;
