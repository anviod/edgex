"use strict";
var iconToBottom = require("./icon-to-bottom.js");
const IconToBottom = Object.assign(iconToBottom, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconToBottom.name, iconToBottom);
  }
});
module.exports = IconToBottom;
