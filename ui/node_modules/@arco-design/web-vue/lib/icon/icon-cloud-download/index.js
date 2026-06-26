"use strict";
var iconCloudDownload = require("./icon-cloud-download.js");
const IconCloudDownload = Object.assign(iconCloudDownload, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCloudDownload.name, iconCloudDownload);
  }
});
module.exports = IconCloudDownload;
