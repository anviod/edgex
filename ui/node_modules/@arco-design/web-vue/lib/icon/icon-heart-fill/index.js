"use strict";
var iconHeartFill = require("./icon-heart-fill.js");
const IconHeartFill = Object.assign(iconHeartFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconHeartFill.name, iconHeartFill);
  }
});
module.exports = IconHeartFill;
