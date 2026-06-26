"use strict";
var iconTwitterCircleFill = require("./icon-twitter-circle-fill.js");
const IconTwitterCircleFill = Object.assign(iconTwitterCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTwitterCircleFill.name, iconTwitterCircleFill);
  }
});
module.exports = IconTwitterCircleFill;
