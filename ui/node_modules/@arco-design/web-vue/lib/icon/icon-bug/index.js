"use strict";
var iconBug = require("./icon-bug.js");
const IconBug = Object.assign(iconBug, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBug.name, iconBug);
  }
});
module.exports = IconBug;
