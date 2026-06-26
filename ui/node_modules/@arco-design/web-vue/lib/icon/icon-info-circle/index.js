"use strict";
var iconInfoCircle = require("./icon-info-circle.js");
const IconInfoCircle = Object.assign(iconInfoCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconInfoCircle.name, iconInfoCircle);
  }
});
module.exports = IconInfoCircle;
