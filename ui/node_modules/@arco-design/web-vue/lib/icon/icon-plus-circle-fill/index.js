"use strict";
var iconPlusCircleFill = require("./icon-plus-circle-fill.js");
const IconPlusCircleFill = Object.assign(iconPlusCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlusCircleFill.name, iconPlusCircleFill);
  }
});
module.exports = IconPlusCircleFill;
