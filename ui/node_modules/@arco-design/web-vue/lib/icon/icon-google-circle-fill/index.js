"use strict";
var iconGoogleCircleFill = require("./icon-google-circle-fill.js");
const IconGoogleCircleFill = Object.assign(iconGoogleCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconGoogleCircleFill.name, iconGoogleCircleFill);
  }
});
module.exports = IconGoogleCircleFill;
