"use strict";
var iconPauseCircle = require("./icon-pause-circle.js");
const IconPauseCircle = Object.assign(iconPauseCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPauseCircle.name, iconPauseCircle);
  }
});
module.exports = IconPauseCircle;
