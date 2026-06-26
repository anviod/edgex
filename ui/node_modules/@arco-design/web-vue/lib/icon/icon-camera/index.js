"use strict";
var iconCamera = require("./icon-camera.js");
const IconCamera = Object.assign(iconCamera, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCamera.name, iconCamera);
  }
});
module.exports = IconCamera;
