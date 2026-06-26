"use strict";
var iconPlayCircle = require("./icon-play-circle.js");
const IconPlayCircle = Object.assign(iconPlayCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlayCircle.name, iconPlayCircle);
  }
});
module.exports = IconPlayCircle;
