"use strict";
var iconCaretDown = require("./icon-caret-down.js");
const IconCaretDown = Object.assign(iconCaretDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCaretDown.name, iconCaretDown);
  }
});
module.exports = IconCaretDown;
