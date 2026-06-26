"use strict";
var iconSubscribe = require("./icon-subscribe.js");
const IconSubscribe = Object.assign(iconSubscribe, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSubscribe.name, iconSubscribe);
  }
});
module.exports = IconSubscribe;
