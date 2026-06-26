"use strict";
var iconDragArrow = require("./icon-drag-arrow.js");
const IconDragArrow = Object.assign(iconDragArrow, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDragArrow.name, iconDragArrow);
  }
});
module.exports = IconDragArrow;
