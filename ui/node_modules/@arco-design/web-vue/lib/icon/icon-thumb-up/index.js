"use strict";
var iconThumbUp = require("./icon-thumb-up.js");
const IconThumbUp = Object.assign(iconThumbUp, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconThumbUp.name, iconThumbUp);
  }
});
module.exports = IconThumbUp;
