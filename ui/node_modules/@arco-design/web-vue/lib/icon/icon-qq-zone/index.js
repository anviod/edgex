"use strict";
var iconQqZone = require("./icon-qq-zone.js");
const IconQqZone = Object.assign(iconQqZone, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQqZone.name, iconQqZone);
  }
});
module.exports = IconQqZone;
