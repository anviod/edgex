"use strict";
var iconThumbUpFill = require("./icon-thumb-up-fill.js");
const IconThumbUpFill = Object.assign(iconThumbUpFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconThumbUpFill.name, iconThumbUpFill);
  }
});
module.exports = IconThumbUpFill;
