"use strict";
var iconMoreVertical = require("./icon-more-vertical.js");
const IconMoreVertical = Object.assign(iconMoreVertical, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMoreVertical.name, iconMoreVertical);
  }
});
module.exports = IconMoreVertical;
