"use strict";
var iconChineseFill = require("./icon-chinese-fill.js");
const IconChineseFill = Object.assign(iconChineseFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconChineseFill.name, iconChineseFill);
  }
});
module.exports = IconChineseFill;
