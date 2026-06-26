"use strict";
var iconPaste = require("./icon-paste.js");
const IconPaste = Object.assign(iconPaste, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPaste.name, iconPaste);
  }
});
module.exports = IconPaste;
