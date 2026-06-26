"use strict";
var iconArrowUp = require("./icon-arrow-up.js");
const IconArrowUp = Object.assign(iconArrowUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArrowUp.name, iconArrowUp);
  }
});
module.exports = IconArrowUp;
