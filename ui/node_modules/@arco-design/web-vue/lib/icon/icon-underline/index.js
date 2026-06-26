"use strict";
var iconUnderline = require("./icon-underline.js");
const IconUnderline = Object.assign(iconUnderline, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUnderline.name, iconUnderline);
  }
});
module.exports = IconUnderline;
