"use strict";
var iconGoogle = require("./icon-google.js");
const IconGoogle = Object.assign(iconGoogle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconGoogle.name, iconGoogle);
  }
});
module.exports = IconGoogle;
