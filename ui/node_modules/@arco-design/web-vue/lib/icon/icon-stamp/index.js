"use strict";
var iconStamp = require("./icon-stamp.js");
const IconStamp = Object.assign(iconStamp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconStamp.name, iconStamp);
  }
});
module.exports = IconStamp;
