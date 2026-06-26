"use strict";
var iconLayers = require("./icon-layers.js");
const IconLayers = Object.assign(iconLayers, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLayers.name, iconLayers);
  }
});
module.exports = IconLayers;
