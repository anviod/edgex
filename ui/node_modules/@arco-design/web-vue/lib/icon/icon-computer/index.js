"use strict";
var iconComputer = require("./icon-computer.js");
const IconComputer = Object.assign(iconComputer, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconComputer.name, iconComputer);
  }
});
module.exports = IconComputer;
