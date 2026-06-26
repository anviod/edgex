"use strict";
var iconXiguaColor = require("./icon-xigua-color.js");
const IconXiguaColor = Object.assign(iconXiguaColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconXiguaColor.name, iconXiguaColor);
  }
});
module.exports = IconXiguaColor;
