"use strict";
var iconLock = require("./icon-lock.js");
const IconLock = Object.assign(iconLock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLock.name, iconLock);
  }
});
module.exports = IconLock;
