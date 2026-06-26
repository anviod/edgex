"use strict";
var iconPlayArrow = require("./icon-play-arrow.js");
const IconPlayArrow = Object.assign(iconPlayArrow, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlayArrow.name, iconPlayArrow);
  }
});
module.exports = IconPlayArrow;
