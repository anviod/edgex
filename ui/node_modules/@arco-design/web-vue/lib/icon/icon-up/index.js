"use strict";
var iconUp = require("./icon-up.js");
const IconUp = Object.assign(iconUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUp.name, iconUp);
  }
});
module.exports = IconUp;
