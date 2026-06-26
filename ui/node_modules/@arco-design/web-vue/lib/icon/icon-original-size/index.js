"use strict";
var iconOriginalSize = require("./icon-original-size.js");
const IconOriginalSize = Object.assign(iconOriginalSize, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconOriginalSize.name, iconOriginalSize);
  }
});
module.exports = IconOriginalSize;
