"use strict";
var iconTwitter = require("./icon-twitter.js");
const IconTwitter = Object.assign(iconTwitter, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTwitter.name, iconTwitter);
  }
});
module.exports = IconTwitter;
