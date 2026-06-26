"use strict";
var iconUser = require("./icon-user.js");
const IconUser = Object.assign(iconUser, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUser.name, iconUser);
  }
});
module.exports = IconUser;
