"use strict";
var iconInfoCircleFill = require("./icon-info-circle-fill.js");
const IconInfoCircleFill = Object.assign(iconInfoCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconInfoCircleFill.name, iconInfoCircleFill);
  }
});
module.exports = IconInfoCircleFill;
