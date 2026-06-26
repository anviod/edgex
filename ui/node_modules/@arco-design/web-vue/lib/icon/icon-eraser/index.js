"use strict";
var iconEraser = require("./icon-eraser.js");
const IconEraser = Object.assign(iconEraser, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEraser.name, iconEraser);
  }
});
module.exports = IconEraser;
