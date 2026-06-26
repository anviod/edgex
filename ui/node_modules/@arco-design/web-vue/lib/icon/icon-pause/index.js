"use strict";
var iconPause = require("./icon-pause.js");
const IconPause = Object.assign(iconPause, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPause.name, iconPause);
  }
});
module.exports = IconPause;
