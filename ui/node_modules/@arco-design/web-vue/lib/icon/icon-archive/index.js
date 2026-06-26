"use strict";
var iconArchive = require("./icon-archive.js");
const IconArchive = Object.assign(iconArchive, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconArchive.name, iconArchive);
  }
});
module.exports = IconArchive;
