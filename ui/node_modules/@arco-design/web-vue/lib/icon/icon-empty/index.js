"use strict";
var iconEmpty = require("./icon-empty.js");
const IconEmpty = Object.assign(iconEmpty, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEmpty.name, iconEmpty);
  }
});
module.exports = IconEmpty;
