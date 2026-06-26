"use strict";
var iconLeftCircle = require("./icon-left-circle.js");
const IconLeftCircle = Object.assign(iconLeftCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLeftCircle.name, iconLeftCircle);
  }
});
module.exports = IconLeftCircle;
