"use strict";
var iconCaretUp = require("./icon-caret-up.js");
const IconCaretUp = Object.assign(iconCaretUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCaretUp.name, iconCaretUp);
  }
});
module.exports = IconCaretUp;
