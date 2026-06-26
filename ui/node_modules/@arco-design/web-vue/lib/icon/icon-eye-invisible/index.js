"use strict";
var iconEyeInvisible = require("./icon-eye-invisible.js");
const IconEyeInvisible = Object.assign(iconEyeInvisible, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEyeInvisible.name, iconEyeInvisible);
  }
});
module.exports = IconEyeInvisible;
