"use strict";
var iconUnlock = require("./icon-unlock.js");
const IconUnlock = Object.assign(iconUnlock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUnlock.name, iconUnlock);
  }
});
module.exports = IconUnlock;
