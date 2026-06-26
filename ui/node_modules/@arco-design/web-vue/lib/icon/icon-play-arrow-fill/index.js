"use strict";
var iconPlayArrowFill = require("./icon-play-arrow-fill.js");
const IconPlayArrowFill = Object.assign(iconPlayArrowFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconPlayArrowFill.name, iconPlayArrowFill);
  }
});
module.exports = IconPlayArrowFill;
