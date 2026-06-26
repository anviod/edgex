"use strict";
var iconMan = require("./icon-man.js");
const IconMan = Object.assign(iconMan, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMan.name, iconMan);
  }
});
module.exports = IconMan;
