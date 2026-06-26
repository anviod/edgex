"use strict";
var iconZoomOut = require("./icon-zoom-out.js");
const IconZoomOut = Object.assign(iconZoomOut, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconZoomOut.name, iconZoomOut);
  }
});
module.exports = IconZoomOut;
