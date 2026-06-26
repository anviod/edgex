"use strict";
var iconQq = require("./icon-qq.js");
const IconQq = Object.assign(iconQq, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQq.name, iconQq);
  }
});
module.exports = IconQq;
