"use strict";
var iconEar = require("./icon-ear.js");
const IconEar = Object.assign(iconEar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEar.name, iconEar);
  }
});
module.exports = IconEar;
