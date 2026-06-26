"use strict";
var iconFile = require("./icon-file.js");
const IconFile = Object.assign(iconFile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFile.name, iconFile);
  }
});
module.exports = IconFile;
