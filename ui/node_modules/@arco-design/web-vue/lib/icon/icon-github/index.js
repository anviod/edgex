"use strict";
var iconGithub = require("./icon-github.js");
const IconGithub = Object.assign(iconGithub, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconGithub.name, iconGithub);
  }
});
module.exports = IconGithub;
