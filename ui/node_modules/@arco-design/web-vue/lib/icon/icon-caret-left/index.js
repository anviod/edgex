"use strict";
var iconCaretLeft = require("./icon-caret-left.js");
const IconCaretLeft = Object.assign(iconCaretLeft, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCaretLeft.name, iconCaretLeft);
  }
});
module.exports = IconCaretLeft;
