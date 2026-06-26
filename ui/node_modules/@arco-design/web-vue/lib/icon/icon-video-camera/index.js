"use strict";
var iconVideoCamera = require("./icon-video-camera.js");
const IconVideoCamera = Object.assign(iconVideoCamera, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconVideoCamera.name, iconVideoCamera);
  }
});
module.exports = IconVideoCamera;
