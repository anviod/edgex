"use strict";
var iconDragDot = require("./icon-drag-dot.js");
const IconDragDot = Object.assign(iconDragDot, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDragDot.name, iconDragDot);
  }
});
module.exports = IconDragDot;
