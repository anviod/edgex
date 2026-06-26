"use strict";
var iconStrikethrough = require("./icon-strikethrough.js");
const IconStrikethrough = Object.assign(iconStrikethrough, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconStrikethrough.name, iconStrikethrough);
  }
});
module.exports = IconStrikethrough;
