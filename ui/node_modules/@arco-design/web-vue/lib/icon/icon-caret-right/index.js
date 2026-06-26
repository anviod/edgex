"use strict";
var iconCaretRight = require("./icon-caret-right.js");
const IconCaretRight = Object.assign(iconCaretRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCaretRight.name, iconCaretRight);
  }
});
module.exports = IconCaretRight;
