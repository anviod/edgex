"use strict";
var iconClockCircle = require("./icon-clock-circle.js");
const IconClockCircle = Object.assign(iconClockCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconClockCircle.name, iconClockCircle);
  }
});
module.exports = IconClockCircle;
