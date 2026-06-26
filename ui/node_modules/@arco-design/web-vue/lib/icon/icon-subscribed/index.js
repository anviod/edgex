"use strict";
var iconSubscribed = require("./icon-subscribed.js");
const IconSubscribed = Object.assign(iconSubscribed, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSubscribed.name, iconSubscribed);
  }
});
module.exports = IconSubscribed;
