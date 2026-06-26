"use strict";
var iconItalic = require("./icon-italic.js");
const IconItalic = Object.assign(iconItalic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconItalic.name, iconItalic);
  }
});
module.exports = IconItalic;
