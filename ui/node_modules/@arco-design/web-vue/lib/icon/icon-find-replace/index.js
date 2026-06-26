"use strict";
var iconFindReplace = require("./icon-find-replace.js");
const IconFindReplace = Object.assign(iconFindReplace, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFindReplace.name, iconFindReplace);
  }
});
module.exports = IconFindReplace;
