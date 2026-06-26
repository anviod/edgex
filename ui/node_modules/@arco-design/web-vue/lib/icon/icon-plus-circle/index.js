"use strict";
var iconPlusCircle = require("./icon-plus-circle.js");
const IconPlusCircle = Object.assign(iconPlusCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlusCircle.name, iconPlusCircle);
  }
});
module.exports = IconPlusCircle;
