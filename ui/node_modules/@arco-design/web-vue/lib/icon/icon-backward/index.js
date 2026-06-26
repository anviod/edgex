"use strict";
var iconBackward = require("./icon-backward.js");
const IconBackward = Object.assign(iconBackward, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBackward.name, iconBackward);
  }
});
module.exports = IconBackward;
