"use strict";
var iconCloseCircle = require("./icon-close-circle.js");
const IconCloseCircle = Object.assign(iconCloseCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCloseCircle.name, iconCloseCircle);
  }
});
module.exports = IconCloseCircle;
