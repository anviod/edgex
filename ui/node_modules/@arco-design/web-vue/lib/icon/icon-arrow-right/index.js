"use strict";
var iconArrowRight = require("./icon-arrow-right.js");
const IconArrowRight = Object.assign(iconArrowRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowRight.name, iconArrowRight);
  }
});
module.exports = IconArrowRight;
