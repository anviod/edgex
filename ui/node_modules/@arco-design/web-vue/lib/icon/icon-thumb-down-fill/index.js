"use strict";
var iconThumbDownFill = require("./icon-thumb-down-fill.js");
const IconThumbDownFill = Object.assign(iconThumbDownFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconThumbDownFill.name, iconThumbDownFill);
  }
});
module.exports = IconThumbDownFill;
