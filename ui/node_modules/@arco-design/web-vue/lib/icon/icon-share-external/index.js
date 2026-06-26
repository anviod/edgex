"use strict";
var iconShareExternal = require("./icon-share-external.js");
const IconShareExternal = Object.assign(iconShareExternal, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconShareExternal.name, iconShareExternal);
  }
});
module.exports = IconShareExternal;
