"use strict";
var iconFaceMehFill = require("./icon-face-meh-fill.js");
const IconFaceMehFill = Object.assign(iconFaceMehFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFaceMehFill.name, iconFaceMehFill);
  }
});
module.exports = IconFaceMehFill;
