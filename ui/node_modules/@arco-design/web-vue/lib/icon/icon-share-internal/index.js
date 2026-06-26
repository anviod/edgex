"use strict";
var iconShareInternal = require("./icon-share-internal.js");
const IconShareInternal = Object.assign(iconShareInternal, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconShareInternal.name, iconShareInternal);
  }
});
module.exports = IconShareInternal;
