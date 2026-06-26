"use strict";
var iconCopyright = require("./icon-copyright.js");
const IconCopyright = Object.assign(iconCopyright, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCopyright.name, iconCopyright);
  }
});
module.exports = IconCopyright;
