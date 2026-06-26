"use strict";
var iconImport = require("./icon-import.js");
const IconImport = Object.assign(iconImport, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconImport.name, iconImport);
  }
});
module.exports = IconImport;
