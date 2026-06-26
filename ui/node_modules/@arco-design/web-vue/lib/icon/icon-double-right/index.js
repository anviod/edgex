"use strict";
var iconDoubleRight = require("./icon-double-right.js");
const IconDoubleRight = Object.assign(iconDoubleRight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDoubleRight.name, iconDoubleRight);
  }
});
module.exports = IconDoubleRight;
