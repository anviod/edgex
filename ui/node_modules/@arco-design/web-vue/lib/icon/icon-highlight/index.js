"use strict";
var iconHighlight = require("./icon-highlight.js");
const IconHighlight = Object.assign(iconHighlight, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconHighlight.name, iconHighlight);
  }
});
module.exports = IconHighlight;
