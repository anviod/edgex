"use strict";
var iconDriveFile = require("./icon-drive-file.js");
const IconDriveFile = Object.assign(iconDriveFile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDriveFile.name, iconDriveFile);
  }
});
module.exports = IconDriveFile;
