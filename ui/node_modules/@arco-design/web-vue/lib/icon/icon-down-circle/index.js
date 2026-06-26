"use strict";
var iconDownCircle = require("./icon-down-circle.js");
const IconDownCircle = Object.assign(iconDownCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDownCircle.name, iconDownCircle);
  }
});
module.exports = IconDownCircle;
