"use strict";
var iconLineHeight = require("./icon-line-height.js");
const IconLineHeight = Object.assign(iconLineHeight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLineHeight.name, iconLineHeight);
  }
});
module.exports = IconLineHeight;
