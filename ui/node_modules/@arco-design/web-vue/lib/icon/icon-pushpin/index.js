"use strict";
var iconPushpin = require("./icon-pushpin.js");
const IconPushpin = Object.assign(iconPushpin, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPushpin.name, iconPushpin);
  }
});
module.exports = IconPushpin;
