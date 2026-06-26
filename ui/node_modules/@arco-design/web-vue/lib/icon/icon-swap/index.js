"use strict";
var iconSwap = require("./icon-swap.js");
const IconSwap = Object.assign(iconSwap, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSwap.name, iconSwap);
  }
});
module.exports = IconSwap;
