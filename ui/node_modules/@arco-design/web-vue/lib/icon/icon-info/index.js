"use strict";
var iconInfo = require("./icon-info.js");
const IconInfo = Object.assign(iconInfo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconInfo.name, iconInfo);
  }
});
module.exports = IconInfo;
