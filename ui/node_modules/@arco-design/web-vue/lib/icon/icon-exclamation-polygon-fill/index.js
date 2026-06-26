"use strict";
var iconExclamationPolygonFill = require("./icon-exclamation-polygon-fill.js");
const IconExclamationPolygonFill = Object.assign(iconExclamationPolygonFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconExclamationPolygonFill.name, iconExclamationPolygonFill);
  }
});
module.exports = IconExclamationPolygonFill;
