"use strict";
var iconPublic = require("./icon-public.js");
const IconPublic = Object.assign(iconPublic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPublic.name, iconPublic);
  }
});
module.exports = IconPublic;
