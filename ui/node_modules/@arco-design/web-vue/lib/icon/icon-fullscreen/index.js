"use strict";
var iconFullscreen = require("./icon-fullscreen.js");
const IconFullscreen = Object.assign(iconFullscreen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFullscreen.name, iconFullscreen);
  }
});
module.exports = IconFullscreen;
