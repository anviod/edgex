"use strict";
var iconSound = require("./icon-sound.js");
const IconSound = Object.assign(iconSound, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSound.name, iconSound);
  }
});
module.exports = IconSound;
