"use strict";
var iconDragDotVertical = require("./icon-drag-dot-vertical.js");
const IconDragDotVertical = Object.assign(iconDragDotVertical, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconDragDotVertical.name, iconDragDotVertical);
  }
});
module.exports = IconDragDotVertical;
