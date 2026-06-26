"use strict";
var iconLoading = require("./icon-loading.js");
const IconLoading = Object.assign(iconLoading, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLoading.name, iconLoading);
  }
});
module.exports = IconLoading;
