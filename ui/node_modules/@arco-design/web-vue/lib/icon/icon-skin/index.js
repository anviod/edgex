"use strict";
var iconSkin = require("./icon-skin.js");
const IconSkin = Object.assign(iconSkin, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSkin.name, iconSkin);
  }
});
module.exports = IconSkin;
