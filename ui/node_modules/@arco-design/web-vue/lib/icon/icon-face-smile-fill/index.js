"use strict";
var iconFaceSmileFill = require("./icon-face-smile-fill.js");
const IconFaceSmileFill = Object.assign(iconFaceSmileFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFaceSmileFill.name, iconFaceSmileFill);
  }
});
module.exports = IconFaceSmileFill;
