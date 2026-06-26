"use strict";
var iconPauseCircleFill = require("./icon-pause-circle-fill.js");
const IconPauseCircleFill = Object.assign(iconPauseCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPauseCircleFill.name, iconPauseCircleFill);
  }
});
module.exports = IconPauseCircleFill;
