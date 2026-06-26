"use strict";
var iconArrowLeft = require("./icon-arrow-left.js");
const IconArrowLeft = Object.assign(iconArrowLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowLeft.name, iconArrowLeft);
  }
});
module.exports = IconArrowLeft;
