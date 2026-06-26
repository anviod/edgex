"use strict";
var iconExclamationCircle = require("./icon-exclamation-circle.js");
const IconExclamationCircle = Object.assign(iconExclamationCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconExclamationCircle.name, iconExclamationCircle);
  }
});
module.exports = IconExclamationCircle;
