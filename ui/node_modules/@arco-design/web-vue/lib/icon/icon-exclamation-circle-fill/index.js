"use strict";
var iconExclamationCircleFill = require("./icon-exclamation-circle-fill.js");
const IconExclamationCircleFill = Object.assign(iconExclamationCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconExclamationCircleFill.name, iconExclamationCircleFill);
  }
});
module.exports = IconExclamationCircleFill;
