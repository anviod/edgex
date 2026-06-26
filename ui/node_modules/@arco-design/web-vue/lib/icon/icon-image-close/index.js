"use strict";
var iconImageClose = require("./icon-image-close.js");
const IconImageClose = Object.assign(iconImageClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconImageClose.name, iconImageClose);
  }
});
module.exports = IconImageClose;
