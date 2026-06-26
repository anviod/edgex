"use strict";
var iconPrinter = require("./icon-printer.js");
const IconPrinter = Object.assign(iconPrinter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPrinter.name, iconPrinter);
  }
});
module.exports = IconPrinter;
