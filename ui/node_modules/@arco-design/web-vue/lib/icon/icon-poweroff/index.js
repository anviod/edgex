"use strict";
var iconPoweroff = require("./icon-poweroff.js");
const IconPoweroff = Object.assign(iconPoweroff, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPoweroff.name, iconPoweroff);
  }
});
module.exports = IconPoweroff;
