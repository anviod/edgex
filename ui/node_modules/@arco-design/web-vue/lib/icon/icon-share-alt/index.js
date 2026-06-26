"use strict";
var iconShareAlt = require("./icon-share-alt.js");
const IconShareAlt = Object.assign(iconShareAlt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconShareAlt.name, iconShareAlt);
  }
});
module.exports = IconShareAlt;
