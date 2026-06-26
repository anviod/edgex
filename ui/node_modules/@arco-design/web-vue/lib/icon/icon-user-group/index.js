"use strict";
var iconUserGroup = require("./icon-user-group.js");
const IconUserGroup = Object.assign(iconUserGroup, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUserGroup.name, iconUserGroup);
  }
});
module.exports = IconUserGroup;
