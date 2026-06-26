"use strict";
var iconSkipNextFill = require("./icon-skip-next-fill.js");
const IconSkipNextFill = Object.assign(iconSkipNextFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSkipNextFill.name, iconSkipNextFill);
  }
});
module.exports = IconSkipNextFill;
