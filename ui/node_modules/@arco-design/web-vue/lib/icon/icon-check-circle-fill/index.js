"use strict";
var iconCheckCircleFill = require("./icon-check-circle-fill.js");
const IconCheckCircleFill = Object.assign(iconCheckCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCheckCircleFill.name, iconCheckCircleFill);
  }
});
module.exports = IconCheckCircleFill;
