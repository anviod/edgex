"use strict";
var iconSoundFill = require("./icon-sound-fill.js");
const IconSoundFill = Object.assign(iconSoundFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSoundFill.name, iconSoundFill);
  }
});
module.exports = IconSoundFill;
