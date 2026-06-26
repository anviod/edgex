"use strict";
var iconCloseCircleFill = require("./icon-close-circle-fill.js");
const IconCloseCircleFill = Object.assign(iconCloseCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCloseCircleFill.name, iconCloseCircleFill);
  }
});
module.exports = IconCloseCircleFill;
