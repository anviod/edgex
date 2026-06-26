"use strict";
var iconPlayCircleFill = require("./icon-play-circle-fill.js");
const IconPlayCircleFill = Object.assign(iconPlayCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlayCircleFill.name, iconPlayCircleFill);
  }
});
module.exports = IconPlayCircleFill;
