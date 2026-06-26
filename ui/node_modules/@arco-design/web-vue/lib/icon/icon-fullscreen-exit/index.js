"use strict";
var iconFullscreenExit = require("./icon-fullscreen-exit.js");
const IconFullscreenExit = Object.assign(iconFullscreenExit, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFullscreenExit.name, iconFullscreenExit);
  }
});
module.exports = IconFullscreenExit;
