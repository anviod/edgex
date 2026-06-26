"use strict";
var iconMute = require("./icon-mute.js");
const IconMute = Object.assign(iconMute, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMute.name, iconMute);
  }
});
module.exports = IconMute;
