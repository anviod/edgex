"use strict";
var iconThumbDown = require("./icon-thumb-down.js");
const IconThumbDown = Object.assign(iconThumbDown, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconThumbDown.name, iconThumbDown);
  }
});
module.exports = IconThumbDown;
