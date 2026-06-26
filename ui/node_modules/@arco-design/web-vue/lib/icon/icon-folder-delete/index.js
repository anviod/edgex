"use strict";
var iconFolderDelete = require("./icon-folder-delete.js");
const IconFolderDelete = Object.assign(iconFolderDelete, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFolderDelete.name, iconFolderDelete);
  }
});
module.exports = IconFolderDelete;
