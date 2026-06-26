"use strict";
var iconCheckCircle = require("./icon-check-circle.js");
const IconCheckCircle = Object.assign(iconCheckCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCheckCircle.name, iconCheckCircle);
  }
});
module.exports = IconCheckCircle;
