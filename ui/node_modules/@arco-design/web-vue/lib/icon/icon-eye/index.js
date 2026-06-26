"use strict";
var iconEye = require("./icon-eye.js");
const IconEye = Object.assign(iconEye, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEye.name, iconEye);
  }
});
module.exports = IconEye;
