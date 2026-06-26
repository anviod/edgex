"use strict";
var iconMuteFill = require("./icon-mute-fill.js");
const IconMuteFill = Object.assign(iconMuteFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMuteFill.name, iconMuteFill);
  }
});
module.exports = IconMuteFill;
