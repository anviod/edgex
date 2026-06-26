"use strict";
var iconBranch = require("./icon-branch.js");
const IconBranch = Object.assign(iconBranch, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBranch.name, iconBranch);
  }
});
module.exports = IconBranch;
