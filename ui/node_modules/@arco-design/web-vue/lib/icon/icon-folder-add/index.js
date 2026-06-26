"use strict";
var iconFolderAdd = require("./icon-folder-add.js");
const IconFolderAdd = Object.assign(iconFolderAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFolderAdd.name, iconFolderAdd);
  }
});
module.exports = IconFolderAdd;
