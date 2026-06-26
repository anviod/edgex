"use strict";
var iconDelete = require("./icon-delete.js");
const IconDelete = Object.assign(iconDelete, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDelete.name, iconDelete);
  }
});
module.exports = IconDelete;
