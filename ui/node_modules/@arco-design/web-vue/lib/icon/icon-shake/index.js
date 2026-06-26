"use strict";
var iconShake = require("./icon-shake.js");
const IconShake = Object.assign(iconShake, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconShake.name, iconShake);
  }
});
module.exports = IconShake;
