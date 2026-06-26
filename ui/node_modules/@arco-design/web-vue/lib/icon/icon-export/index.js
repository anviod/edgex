"use strict";
var iconExport = require("./icon-export.js");
const IconExport = Object.assign(iconExport, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconExport.name, iconExport);
  }
});
module.exports = IconExport;
