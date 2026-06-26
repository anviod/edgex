"use strict";
var iconAt = require("./icon-at.js");
const IconAt = Object.assign(iconAt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconAt.name, iconAt);
  }
});
module.exports = IconAt;
