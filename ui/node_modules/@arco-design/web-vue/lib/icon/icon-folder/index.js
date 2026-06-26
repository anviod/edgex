"use strict";
var iconFolder = require("./icon-folder.js");
const IconFolder = Object.assign(iconFolder, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFolder.name, iconFolder);
  }
});
module.exports = IconFolder;
