"use strict";
var iconFilePdf = require("./icon-file-pdf.js");
const IconFilePdf = Object.assign(iconFilePdf, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFilePdf.name, iconFilePdf);
  }
});
module.exports = IconFilePdf;
