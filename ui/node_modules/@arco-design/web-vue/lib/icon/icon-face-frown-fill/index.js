"use strict";
var iconFaceFrownFill = require("./icon-face-frown-fill.js");
const IconFaceFrownFill = Object.assign(iconFaceFrownFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFaceFrownFill.name, iconFaceFrownFill);
  }
});
module.exports = IconFaceFrownFill;
