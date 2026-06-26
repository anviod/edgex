"use strict";
var iconMosaic = require("./icon-mosaic.js");
const IconMosaic = Object.assign(iconMosaic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMosaic.name, iconMosaic);
  }
});
module.exports = IconMosaic;
