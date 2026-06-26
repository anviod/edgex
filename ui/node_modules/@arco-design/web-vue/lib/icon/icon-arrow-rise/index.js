"use strict";
var iconArrowRise = require("./icon-arrow-rise.js");
const IconArrowRise = Object.assign(iconArrowRise, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowRise.name, iconArrowRise);
  }
});
module.exports = IconArrowRise;
