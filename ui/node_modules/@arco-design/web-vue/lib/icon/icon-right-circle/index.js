"use strict";
var iconRightCircle = require("./icon-right-circle.js");
const IconRightCircle = Object.assign(iconRightCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRightCircle.name, iconRightCircle);
  }
});
module.exports = IconRightCircle;
