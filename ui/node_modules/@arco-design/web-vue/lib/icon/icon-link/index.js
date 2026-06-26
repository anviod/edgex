"use strict";
var iconLink = require("./icon-link.js");
const IconLink = Object.assign(iconLink, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLink.name, iconLink);
  }
});
module.exports = IconLink;
