"use strict";
var iconPlus = require("./icon-plus.js");
const IconPlus = Object.assign(iconPlus, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlus.name, iconPlus);
  }
});
module.exports = IconPlus;
