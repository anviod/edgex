"use strict";
var iconForward = require("./icon-forward.js");
const IconForward = Object.assign(iconForward, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconForward.name, iconForward);
  }
});
module.exports = IconForward;
