"use strict";
var iconShrink = require("./icon-shrink.js");
const IconShrink = Object.assign(iconShrink, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconShrink.name, iconShrink);
  }
});
module.exports = IconShrink;
