"use strict";
var iconGitlab = require("./icon-gitlab.js");
const IconGitlab = Object.assign(iconGitlab, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconGitlab.name, iconGitlab);
  }
});
module.exports = IconGitlab;
