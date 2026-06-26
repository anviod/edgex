"use strict";
var iconFacebookSquareFill = require("./icon-facebook-square-fill.js");
const IconFacebookSquareFill = Object.assign(iconFacebookSquareFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFacebookSquareFill.name, iconFacebookSquareFill);
  }
});
module.exports = IconFacebookSquareFill;
