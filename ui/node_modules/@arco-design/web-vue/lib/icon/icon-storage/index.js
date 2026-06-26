"use strict";
var iconStorage = require("./icon-storage.js");
const IconStorage = Object.assign(iconStorage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconStorage.name, iconStorage);
  }
});
module.exports = IconStorage;
