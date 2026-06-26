"use strict";
var iconFacebook = require("./icon-facebook.js");
const IconFacebook = Object.assign(iconFacebook, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFacebook.name, iconFacebook);
  }
});
module.exports = IconFacebook;
