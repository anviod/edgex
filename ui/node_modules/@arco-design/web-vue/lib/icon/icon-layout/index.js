"use strict";
var iconLayout = require("./icon-layout.js");
const IconLayout = Object.assign(iconLayout, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLayout.name, iconLayout);
  }
});
module.exports = IconLayout;
