"use strict";
var iconTiktokColor = require("./icon-tiktok-color.js");
const IconTiktokColor = Object.assign(iconTiktokColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTiktokColor.name, iconTiktokColor);
  }
});
module.exports = IconTiktokColor;
