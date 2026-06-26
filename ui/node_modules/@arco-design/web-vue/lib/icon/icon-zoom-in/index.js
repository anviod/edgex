"use strict";
var iconZoomIn = require("./icon-zoom-in.js");
const IconZoomIn = Object.assign(iconZoomIn, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconZoomIn.name, iconZoomIn);
  }
});
module.exports = IconZoomIn;
