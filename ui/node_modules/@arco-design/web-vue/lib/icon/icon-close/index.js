"use strict";
var iconClose = require("./icon-close.js");
const IconClose = Object.assign(iconClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconClose.name, iconClose);
  }
});
module.exports = IconClose;
