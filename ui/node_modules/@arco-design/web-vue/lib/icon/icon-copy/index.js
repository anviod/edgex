"use strict";
var iconCopy = require("./icon-copy.js");
const IconCopy = Object.assign(iconCopy, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCopy.name, iconCopy);
  }
});
module.exports = IconCopy;
