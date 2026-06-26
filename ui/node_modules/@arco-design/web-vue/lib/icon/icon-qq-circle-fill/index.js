"use strict";
var iconQqCircleFill = require("./icon-qq-circle-fill.js");
const IconQqCircleFill = Object.assign(iconQqCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQqCircleFill.name, iconQqCircleFill);
  }
});
module.exports = IconQqCircleFill;
