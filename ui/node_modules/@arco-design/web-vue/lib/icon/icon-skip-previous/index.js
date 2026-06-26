"use strict";
var iconSkipPrevious = require("./icon-skip-previous.js");
const IconSkipPrevious = Object.assign(iconSkipPrevious, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSkipPrevious.name, iconSkipPrevious);
  }
});
module.exports = IconSkipPrevious;
