"use strict";
var iconCloud = require("./icon-cloud.js");
const IconCloud = Object.assign(iconCloud, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCloud.name, iconCloud);
  }
});
module.exports = IconCloud;
