"use strict";
var iconLocation = require("./icon-location.js");
const IconLocation = Object.assign(iconLocation, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLocation.name, iconLocation);
  }
});
module.exports = IconLocation;
