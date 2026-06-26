"use strict";
var iconDownload = require("./icon-download.js");
const IconDownload = Object.assign(iconDownload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDownload.name, iconDownload);
  }
});
module.exports = IconDownload;
