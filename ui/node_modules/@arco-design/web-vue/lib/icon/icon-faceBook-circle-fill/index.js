"use strict";
var iconFaceBookCircleFill = require("./icon-faceBook-circle-fill.js");
const IconFaceBookCircleFill = Object.assign(iconFaceBookCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFaceBookCircleFill.name, iconFaceBookCircleFill);
  }
});
module.exports = IconFaceBookCircleFill;
